const lineService = require('../services/line.service')

// developer userId = U5336d345f5e92d0d1ccd326d5df04a7f

exports.lineMiddleware =  (req, res, next) => {
    console.log(req.body)
    const result = lineService.lineMiddleware
    if(result){
        next()
    }
}

exports.webhookController = async (req, res) => {
    try {
        await lineService.webhookManager(req?.body)
        return res.status(200).json({status: "Ok"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({status : "Something went wrong"})
    }
}


