const db = require('../db/models')


const writeClockIoToMainDb = async (item) => await db.ClockIOHistory.create(item)

module.exports = {
    writeClockIoToMainDb
}