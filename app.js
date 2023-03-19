const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const notificationTrigger = require('./src/services/notificationtrigger.service')
dotenv.config()

const notifyOnTime = () => {
    const notifyTime = {
        clockIn: {
            hour: 8,
            minute: 0,
            sec: 0
        },
        clockOut: {
            hour: 17,
            minute: 0,
            sec: 0
        }

    }

    const timeHour = new Date().getHours()
    const timeMinute = new Date().getMinutes()
    const timeSecond = new Date().getSeconds()

    const isCloseToClockIn = () => {
        if (timeHour === notifyTime.clockIn.hour && timeMinute === notifyTime.clockIn.minute && timeSecond === notifyTime.clockIn.sec) {
            return true
        }
        return false
    }

    const isCloseToClockOut = () => {
        if (timeHour === notifyTime.clockOut.hour && timeMinute === notifyTime.clockOut.minute && timeSecond === notifyTime.clockOut.sec) {
            return true
        }
        return false
    }


}

setInterval(notifyOnTime, 500)



const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3400

app.use(require('./src/routes/routes'))

app.listen(port, async () => {
    console.log(`listen on port ${port}`)
    console.log(process.env.NODE_ENV)
})

