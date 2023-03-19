const db = require('../db/models')

exports.createQueue = async (item) => await db.ListClockIO.create(item)

exports.getAllRequestQueue = async () => await db.ListClockIO.findAll()

exports.findQueueFromUid = async (lineUid) => await db.ListClockIO.findAll({
    where: {
        lineUid
    }
})

exports.editQueueInfo = async (lineUid, editedObject) => await db.ListClockIO.update(editedObject, {
    where: {
        lineUid: lineUid
    }
})

exports.writeLocation = async (lineUid, newObject) => await db.ListClockIO.update(newObject, {
    where: {
        lineUid: lineUid
    }
})


exports.writeImageTimestamp = async (lineUid, imageTimeStamp) => await db.ListClockIO.update(imageTimeStamp, {
    where: {
        lineUid: lineUid
    }
})


exports.removeQueue = async (lineUid) => await db.ListClockIO.destroy({
    where : {
        lineUid: lineUid
    }
})