const ftp_repo = require('../repositories/ftp-rw.repository')


const uploadFileClockIo = async (fileName) => await ftp_repo.uploadFileClockIo(fileName)

module.exports = {
    uploadFileClockIo
}