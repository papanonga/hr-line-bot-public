const clockIOqueueRepository = require('../repositories/clockio-queue.repository')
const lineRepository = require('../repositories/line.repository')
const constants = require('../constants')

const clockIOHistory = require('./clockio-history.service')
const ftpService = require('../services/ftp-rw.service')
const storageRepository = require('../repositories/localstorage.repository')
const ggsRepository = require('../repositories/rwgooglesheet.repository')

const queueManager = async (requestFrom, requestBody) => {
    console.log(` clockio.service => queueManager() -> throw : `)
    // console.log(JSON.stringify(requestBody, null, 2))

    if (requestFrom === constants.REQUEST_FROM_LINE_BUTTON) {
        const userId = requestBody?.events?.[0]?.source?.userId
        const recordFromDb = await clockIOqueueRepository.findQueueFromUid(userId)
        console.log(`record from database ${JSON.stringify(recordFromDb, null, 2)}`)
        // console.log(`Already requested => ${JSON.stringify(requestBody, null, 2)}`)
        // console.log(` record from database => ${JSON.stringify(recordFromDb, null, 2)} `)

        // If it have a queue in table ** continue to inseart data to queue **
        if (recordFromDb.length > 0) {
            console.log(`constants.REQUEST_FROM_LINE_BUTTON => go to eventManager()`)
            const lastStep = recordFromDb?.[0]?.dataValues?.lastStep
            const eventType = recordFromDb?.[0]?.dataValues?.eventType
            await eventManager(eventType, lastStep, requestBody)

        }
        console.log(` ----- end : clockio.service => queueManager()  -----`)

    } else if (requestFrom === constants.SEND_LOCATION_WEB_APP) {
        const userId = requestBody?.userId
        const recordFromDb = await clockIOqueueRepository.findQueueFromUid(userId)
        const lastStep = recordFromDb?.[0]?.dataValues?.lastStep
        const eventType = recordFromDb?.[0]?.dataValues?.eventType
        console.log(` location from web ACE`)
        console.log(`already got location`)
        return await eventManager(eventType, lastStep, requestBody)
    }


}

const operationNumber = {
    clockIn: {
        sentRequest: 1,
        shareLocation: 2,
        sendImage: 3
    },
    clockOut: {
        sentRequest: 1,
        shareLocation: 2,
        sendImage: 3
    }
}

const eventTypeString = {
    clockIn: 'clock in',
    clockOut: 'clock out'
}

const eventManager = async (eventType, last_step, requestBody) => {
    // is expected input

    if (eventType === eventTypeString.clockIn) {
        let userId = '', location = ''
        switch (last_step) {
            case operationNumber.clockIn.sentRequest:
                // then need location

                // Is expected input?
                if (requestBody.location === undefined && requestBody.userId === undefined) {
                    return
                }

                console.log(`clockio-queue.service => eventManager() -> Throw : need location`)
                console.log(requestBody)
                userId = requestBody.userId;
                location = requestBody.location
                await clockInshareLocation(userId, location)
                await lineRepository.sendPushMessage(userId, "I already got your location. Please send a timestamp picture to me")
                console.log("already sent picture")
                break


            case operationNumber.clockIn.shareLocation:
                // then need image                 
                // console.log(JSON.stringify(requestBody, null,2))
                userId = requestBody?.events?.[0]?.source?.userId;
                const imageId = requestBody?.events?.[0]?.message?.id
                // location = requestBody.location
                console.log(`image uploading`)
                await clockInSaveImage(userId, imageId)
                await clockInWriteToMainDb(userId)
                await clockInUploadImage(userId)  // upload to sftp server
                await clockInDeleteImage(userId)   // delete from local storage
                await writeToGoogleSheet(userId)
                await clockInDeleteQueue(userId)
                break

        }
    } else if (eventType === eventTypeString.clockOut) {
        let userId = '', location = ''
        switch (last_step) {
            case operationNumber.clockOut.sentRequest:
                // then need location
                // Is expected input?
                if (requestBody.location === undefined && requestBody.userId === undefined) {
                    return
                }
                console.log(`clockio-queue.service => eventManager() -> Throw : need location clock out`)
                console.log(requestBody)
                userId = requestBody.userId;
                location = requestBody.location
                await clockInshareLocation(userId, location)
                await lineRepository.sendPushMessage(userId, "I already got your location. Please send a timestamp picture to me")
                console.log("already sent picture")
                break


            case operationNumber.clockOut.shareLocation:
                // then need image                 
                // console.log(JSON.stringify(requestBody, null,2))
                userId = requestBody?.events?.[0]?.source?.userId;
                const imageId = requestBody?.events?.[0]?.message?.id
                // location = requestBody.location
                console.log(`image uploading`)
                await clockOutSaveImage(userId, imageId)
                await clockOutWriteToMainDb(userId)
                await clockOutUploadImage(userId)  // upload to sftp server
                await clockOutDeleteImage(userId)   // delete from local storage
                await writeToGoogleSheet(userId)
                await clockOutDeleteQueue(userId)
                break

        }
        return
    }
}


const getClockIOHistoryByUserId = async (id) => await clockIOqueueRepository.findQueueFromUid(id)

const clockInUploadImage = async (userId) => {
    const userInfo = await getClockIOHistoryByUserId(userId)
    const fileName = userInfo[0].imageName
    // console.log(`upload image function : ${JSON.stringify(userInfo, null, 2)}`)
    return await ftpService.uploadFileClockIo(fileName)
}

const clockOutUploadImage = async (userId) => {
    const userInfo = await getClockIOHistoryByUserId(userId)
    const fileName = userInfo[0].imageName
    // console.log(`upload image function : ${JSON.stringify(userInfo, null, 2)}`)
    return await ftpService.uploadFileClockIo(fileName)
}

const clockInSendRequest = async (requestBody) => {
    const userId = requestBody?.events[0]?.source?.userId
    const newQueue = {
        lineUid: userId,
        eventType: 'clock in',
        eventTime: requestBody?.events[0]?.timestamp,
        imageName: '-',
        location: '-',
        lastStep: operationNumber.clockIn.sentRequest
    }
    // console.log(`clockio.service => clockIn() throw -> newQueue : ${JSON.stringify(newQueue)}`)
    await clockIOqueueRepository.createQueue(newQueue)
    await lineRepository.sendPushMessage(userId, "Please share your location by going to this link https://liff.line.me/1657837439-Qx0qOwLX")
    console.log('---- end ----')
    return
}


const clockInshareLocation = async (userId, location) => {
    let recordFromDb = await clockIOqueueRepository.findQueueFromUid(userId)
    console.log(`clockio-queue.service => clockInshareLocation -> throw : `)
    let newData = recordFromDb?.[0]?.dataValues
    newData.location = location
    newData.lastStep = 2
    return await clockIOqueueRepository.writeLocation(userId, newData)
}

const clockInSaveImage = async (userId, imageName) => {
    const savedImageName = await imageVerify(imageName, userId)
    if (savedImageName != undefined) {
        let recordFromDb = await clockIOqueueRepository.findQueueFromUid(userId)
        let newData = recordFromDb?.[0]?.dataValues
        newData.imageName = savedImageName
        newData.lastStep = 3
        // console.log(`save image ${newData}`)
        await clockIOqueueRepository.writeImageTimestamp(userId, newData)
        await lineRepository.sendPushMessage(userId, "Your clock-in was successful")
    }
    return
}

const clockOutSaveImage = async (userId, imageName) => {
    const savedImageName = await imageVerify(imageName, userId)
    if (savedImageName != undefined) {
        let recordFromDb = await clockIOqueueRepository.findQueueFromUid(userId)
        let newData = recordFromDb?.[0]?.dataValues
        newData.imageName = savedImageName
        newData.lastStep = 3
        // console.log(`save image ${newData}`)
        await clockIOqueueRepository.writeImageTimestamp(userId, newData)
        await lineRepository.sendPushMessage(userId, "Your clock-out was successfully")
    }
    return
}


const clockInDeleteImage = async (userId) => {
    const record = await clockIOqueueRepository.findQueueFromUid(userId)
    const fileName = record?.[0]?.dataValues?.imageName
    if (fileName) {
        return storageRepository.removeFile(fileName)
    }
}

const clockOutDeleteImage = async (userId) => {
    const record = await clockIOqueueRepository.findQueueFromUid(userId)
    const fileName = record?.[0]?.dataValues?.imageName
    if (fileName) {
        return storageRepository.removeFile(fileName)
    }
}

const imageVerify = async (imageId, userId) => {
    const imageName = await lineRepository.saveImage(imageId, userId)
    console.log(`isImage? => ${JSON.stringify(imageName, null, 2)}`)
    if (imageName != undefined) {
        return imageName
    }
    return
}

const clockInWriteToMainDb = async (userId) => {
    const recordQueueDb = await getClockIOHistoryByUserId(userId)
    // console.log(`clockInWriteToMainDb : ${JSON.stringify(recordQueueDb[0], null, 2)}`)

    // Has record in queue
    if (recordQueueDb.length >= 1) {
        const item = {
            lineUid: recordQueueDb[0].lineUid,
            eventType: recordQueueDb[0].eventType,
            eventTime: recordQueueDb[0].eventTime,
            imageName: recordQueueDb[0].imageName,
            location: recordQueueDb[0].location
        }
        console.log(Date(item.eventTime))
        return clockIOHistory.writeHistory(item)
    }

    return
}

const clockOutWriteToMainDb = async (userId) => {
    const recordQueueDb = await getClockIOHistoryByUserId(userId)
    // console.log(`clockInWriteToMainDb : ${JSON.stringify(recordQueueDb[0], null, 2)}`)

    // Has record in queue
    if (recordQueueDb.length >= 1) {
        const item = {
            lineUid: recordQueueDb[0].lineUid,
            eventType: recordQueueDb[0].eventType,
            eventTime: recordQueueDb[0].eventTime,
            imageName: recordQueueDb[0].imageName,
            location: recordQueueDb[0].location
        }
        console.log(Date(item.eventTime))
        return clockIOHistory.writeHistory(item)
    }

    return
}

const writeToGoogleSheet = async (userId) => {
    const templateForWriteGoogleSheet = {
        eventId: "",
        lineUid: "",
        eventType: "",
        eventTime: "",
        imageName: "",
        location: ""
    }

    // data: [Object.keys(templateForGoogleSheet).map(key => dataFromLineService[key])]
    const recordQueueDb = await getClockIOHistoryByUserId(userId)
    if (recordQueueDb.length >= 1) {
        const range = `clock-io-history!A2:F`
        const googleDateFormat = `= (${new Date(recordQueueDb[0].eventTime).getTime()}/1000)/86400 + DATE(1970,1,1) + TIME(7,0,19)`
        const item = {
            eventId: `=ROW()-1`,
            lineUid: recordQueueDb[0].lineUid,
            eventType: recordQueueDb[0].eventType,
            eventTime: googleDateFormat,
            imageName: recordQueueDb[0].imageName,
            location: recordQueueDb[0].location
        }
        console.log(`timestamp for google: ${googleDateFormat}`)
        console.log(`time in writer to googlesheet : ${item.eventTime}`)
        const data = [Object.keys(templateForWriteGoogleSheet).map(key => item[key])]
        const writer = {
            range: range,
            data: data
        }
        return await ggsRepository.writeClockIOhistory(writer)

    }
}


const clockInDeleteQueue = async (userId) => await clockIOqueueRepository.removeQueue(userId)

const clockOutDeleteQueue = async (userId) => await clockIOqueueRepository.removeQueue(userId)


const clockOutSendRequest = async (requestBody) => {
    const userId = requestBody?.events[0]?.source?.userId
    const newQueue = {
        lineUid: userId,
        eventType: 'clock out',
        eventTime: requestBody?.events[0]?.timestamp,
        imageName: '-',
        location: '-',
        lastStep: operationNumber.clockIn.sentRequest
    }
    // console.log(`clockio.service => clockIn() throw -> newQueue : ${JSON.stringify(newQueue)}`)
    await clockIOqueueRepository.createQueue(newQueue)
    await lineRepository.sendPushMessage(userId, "Please share your location by go to this link https://liff.line.me/1657837439-Qx0qOwLX")
    console.log('---- end ----')
    return

}


const leaveRequest = async () => {
    console.log('leave request')

}

const leaveApprove = async () => {
    console.log('leave approve')

}


const sickLeave = async () => {
    console.log('sick leave')

}

const annualLeave = async () => {
    console.log('annual leave')
}

module.exports = {
    queueManager,
    clockInshareLocation,
    getClockIOHistoryByUserId,
    clockInSaveImage,
    clockOutSendRequest,
    clockInSendRequest,

}