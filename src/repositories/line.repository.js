const line = require('@line/bot-sdk')
const fs = require('fs')
const path = require('path')


const lineConfig = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_TOKEN
}


const client = new line.Client(lineConfig)

exports.lineMiddleware = line.middleware(lineConfig)

const messageTemplate = (message) => {
    return {
        type: "text",
        text: message
    }
}

exports.sendPushMessage = async (userId, message) => await client.pushMessage(userId, messageTemplate(message))


exports.saveImage = (imageId, userId) => {
    const date = new Date().getDate()
    const month = new Date().getMonth()
    const year = new Date().getFullYear()
    const time = `${new Date().getHours()}:${(new Date().getMinutes() < 10? '0': '' ) + new Date().getMinutes() }:${new Date().getSeconds()}`  
    const template = `${userId}_${date}-${month+1}-${year}_time-${time}`
    return client.getMessageContent(imageId)
        .then( stream => new Promise( (resolve, reject) => {
            const fileName = template
            const fileWriter = fs.createWriteStream(path.join(__dirname, `../../files/${fileName}.jpg`))
            stream.pipe(fileWriter)
            stream.on('end', () => {
                resolve(fileName)
            })
            stream.on('error', (err => reject(err)))
        }))
}
