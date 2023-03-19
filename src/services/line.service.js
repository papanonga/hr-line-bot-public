const lineRepository = require('../repositories/line.repository')
const clockIoService = require('./clockio-queue.service')
const constants = require('../constants')


const requestTypeTemplate = {
    'clock in': 'clock in',
    'clock out': 'clock out',
    'sick leave': 'sick leave',
    'annual leave': 'annual leave',
    'leave request': 'leave request',
    'leave approve': 'leave approve'
}


exports.lineMiddleware = lineRepository.lineMiddleware

exports.webhookManager = async (reqBody) => {

    // case already requested 
    const requesterLineUid = reqBody?.events[0]?.source?.userId
    if (requesterLineUid !== undefined) {
        // Requester has an uid
        const hasRequested = await clockIoService.getClockIOHistoryByUserId(requesterLineUid)
        console.log('line.service => webhookManager() -> throw  Has ever requested = ', hasRequested.length !== 0)
        
        // Already in queue and need to operate
        if (hasRequested.length !== 0) {
            console.log("Queue Detail : ", hasRequested[0]?.dataValues)
            // console.log('line.service => webhookManager() -> throw  Has ever requested = ', reqBody)
            // console.log(`queue datetime : ${new Date(hasRequested[0]?.dataValues.event_time)}`)
            const requestFrom = constants.REQUEST_FROM_LINE_BUTTON
            await clockIoService.queueManager(requestFrom,reqBody)
            return
        }
    }



    // case  input is not expected 
    const requestType = reqBody?.events[0]?.message?.text
    const req = requestTypeTemplate[requestType]
    console.log(reqBody?.events[0])
    if (req === undefined) {
        console.log("Nothing input")
        return
    } else {
        // case first time request and manipulate request 
        await firstTimeRequestManager(req, reqBody)

    }

    return

}

const firstTimeRequestManager = async (requestString, requestBody) => {
    switch (requestString) {
        case 'clock in':
            await clockIoService.clockInSendRequest(requestBody)
            break
        case 'clock out':
            await clockIoService.clockOutSendRequest(requestBody)
            break
        case 'sick leave':
            await clockIoService.sickLeave()
            break
        case 'annual leave':
            await clockIoService.annualLeave()
            break
        case 'leave request':
            await clockIoService.leaveRequest()
            break
        case 'leave approve':
            await clockIoService.leaveApprove()
            break
    }
    return

}


