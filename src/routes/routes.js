const router = require('express').Router()

router.use("/hr-bot", require("./line.route"))
router.use("/clockio", require("./clockio.route"))

module.exports = router