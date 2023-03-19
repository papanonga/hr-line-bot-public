const registerService = require('../services/register.service')
const lineRepository = require('../repositories/line.repository')

const isRegister = async (req, res, cb) => {
    const incomingLineUid = req?.body?.events[0]?.source?.userId
    const incomingMessage = req?.body?.events[0]?.message?.text
    if (incomingLineUid) {
        const isEmployee = await registerService.isEmployee(incomingLineUid)
        if (isEmployee === null) {
            // warning something to guest 
            //  do something   

            // let them register
            const token = incomingMessage
            const lindUid = incomingLineUid
            const result = await registerService.register(token, lindUid)
            console.log(`register result ${result}`)
            if (result === true) {
                return await lineRepository.sendPushMessage(incomingLineUid, "The registration process was completed successfully")

            }
            else {
                return await lineRepository.sendPushMessage(incomingLineUid, "You are not an ACE employee. Would you like to register?\nPlease send me your activation code.")

            }
        } else {
            cb()
        }
    }
}




module.exports = {
    isRegister
}