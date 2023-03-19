const router = require('express').Router()
const clockIoController = require('../controllers/clockio.controller')


router.post("/location", clockIoController.clockIOcontroller)


module.exports = router