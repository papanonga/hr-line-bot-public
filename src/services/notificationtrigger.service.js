const employeeService = require('./employee.service')

const notifyOnTime = async () => {

    // setup your time for notification
    const notifyTime = {

        clockIn: {
            hour: 8,
            minute: 30,
            sec: 0
        },
        clockOut: {
            hour: 17,
            minute: 15,
            sec: 0
        }

    }

    const timeHour = new Date().getHours()
    const timeMinute = new Date().getMinutes()
    const timeSecond = new Date().getSeconds()

    // console.log(`second : ${timeSecond}`)

    const isCloseToClockIn = () => {
        const isClockInTime = timeHour === notifyTime.clockIn.hour && timeMinute === notifyTime.clockIn.minute && timeSecond === notifyTime.clockIn.sec
        if (isClockInTime) {
            return true
        }
        return false
    }


    const isCloseToClockOut = () => {
        const isClockOutTime = timeHour === notifyTime.clockOut.hour && timeMinute === notifyTime.clockOut.minute && timeSecond === notifyTime.clockOut.sec
        if (isClockOutTime) {
            return true
        }
        return false
    }




    // notificagtion when close to clock-in
    if (isCloseToClockIn()) {
        // notify for close to clock-in
        // do something here

        // console.log("clock in time")
        const employeeRegistered = await employeeService.findOnlyEmployeeRegistered()
        employeeRegistered.forEach(async (elem) => {
            await lineRepository.sendPushMessage(elem.lineUid, "It's almost time to start work.")
        })


    } else if (isCloseToClockOut()) {
        // notify for close to clock-out
        // do something here


        // console.log("clock out time")
        const employeeRegistered = await employeeService.findOnlyEmployeeRegistered()
        employeeRegistered.forEach(async (elem) => {
            await lineRepository.sendPushMessage(elem.lineUid, "It's almost time to go home :D")
        })
    }

}


setInterval(notifyOnTime, 1000)

