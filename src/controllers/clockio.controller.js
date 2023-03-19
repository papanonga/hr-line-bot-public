const clockIOservice = require("../services/clockio-queue.service")
const constants = require('../constants')

// const demoFuncService = require('../services/clockio-history.service')


exports.clockIOcontroller = async (req, res) => {
    try {
        console.log(` payload from Web Location -> req.body : ${JSON.stringify(req.body)}`)

        // const data = JSON.parse(JSON.stringify(req.body))
        // console.log(` userId : ${data?.userId}`)
        // console.log(` location : ${data?.location}`)


        const requestFrom = constants.SEND_LOCATION_WEB_APP
        await clockIOservice.queueManager(requestFrom, req?.body)
        
        return res.status(200).json({status: "Ok"})

    } catch (error) {
        console.error(error)
        return res.status(500).json({status : "Something went wrong"})
    }
}

// exports.demoCall = async () => {
//     try {
//         const lineUid = 'U5336d345f5e92d0d1ccd326d5df04a7f'
//         await demoFuncService.getQueueByLineUid(lineUid)
//         console.log('status')
//         return 
//     } catch (error) {
        
//     }
// }