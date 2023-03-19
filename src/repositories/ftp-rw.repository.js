const Client = require("ssh2-sftp-client")
let sftp = new Client()
const path = require('path')
const dotenv = require('dotenv')
const fs = require('fs')
dotenv.config()


const connection = {
    host: process.env.CONNECTION_HOST,
    port: process.env.CONNECTION_PORT,
    username: process.env.CONNECTION_USERNAME,
    password: process.env.CONNECTION_PASSWORD
}

const remoteDirectory = (filename) => {
    return `/home/hr-service-storage/image-clockio/${new Date().getFullYear()}/${new Date().getMonth()+1}/${filename}.jpg`
}

const pathFileUpload = (fileName) => {
    return path.resolve(__dirname, `../../files/${fileName}.jpg`)
}


const uploadFileClockIo = async (fileName) => {
    console.log("uploadFileClockIo")
    const isConnectedLocal = await isConnected()
    console.log(`connection status ${isConnectedLocal}`)
    if (isConnectedLocal === true) {
        console.log(`fileName : '${fileName}'`)
        const remotePathforChecking = `/home/hr-service-storage/image-clockio/${new Date().getFullYear()}/${new Date().getMonth()+1}`
        const pathIsExist = await sftp.exists(remotePathforChecking)
        console.log(`path isExist ${pathIsExist}`)
        if(!pathIsExist){
            await sftp.mkdir(remotePathforChecking, true)
        }

        const result = await sftp.put( pathFileUpload(fileName), remoteDirectory(fileName))
        // console.log(`status : ${result}`)
        const endConnection = await sftp.end()
        console.log(`disconnect status : ${endConnection}`)
        return result
    }
    return
}

const isConnected = async () => {
    try {
        if (await sftp.connect(connection)) {
            return true
        }
    } catch (error) {
        // console.log(`FTP was error `)
        console.log(error)
        return false
    }
}

module.exports = {
    uploadFileClockIo
}