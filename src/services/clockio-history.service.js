const clockIoHistory = require('../repositories/clockio-history.repository')

const writeHistory = async (item) => await clockIoHistory.writeClockIoToMainDb(item)


module.exports = {
    writeHistory
}