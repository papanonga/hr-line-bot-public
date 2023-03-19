const router = require('express').Router()
const lineController = require('../controllers/line.controller')

const isEmployee = require('../controllers/register.controller')
// router.post("/webhook", lineController.lineMiddleware, lineController.webhookController)
router.post("/webhook", isEmployee.isRegister, lineController.webhookController)


module.exports = router