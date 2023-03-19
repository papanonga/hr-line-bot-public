const employeeRepository = require('../repositories/employee.repository')
const registerRepository = require('../repositories/register.repository')
const jwt = require('../services/jwt')

// return null if this lineUid is not employee
const isEmployee = async (lineUid) => await employeeRepository.findUserByLineUid(lineUid)

const register = async (token, lineUid) => {
    console.log(`token in register : ${token}`)
    console.log(`lineUid in regiser : ${lineUid}`)
    const userId = await jwt.verifyToken(token).catch(err => err)

    let registerState = {
        isWriteLineUid: false,
        isAlreadActivated: false
    }

    if (userId) {
        // edit lineUid in employee table with userId

        let employeeRecord = await employeeRepository.findOneEmployee(userId)
        if (employeeRecord) {
            employeeRecord = JSON.parse(JSON.stringify(employeeRecord, null, 2))
            employeeRecord.lineUid = lineUid
            console.log(employeeRecord)
            await employeeRepository.update(userId, employeeRecord)
            registerState.isWriteLineUid = true
            console.log(`status after update line uid ${registerState.isWriteLineUid}`)
        }

        // edit activations table to record isUsed to true
        let activationRecord = await registerRepository.findTokenByUserId(userId)
        if (activationRecord) {
            activationRecord = JSON.parse(JSON.stringify(employeeRecord, null, 2))
            activationRecord.isUsed = true
            await registerRepository.updateTokenUsed(activationRecord.id, activationRecord)
            console.log(`update code status : ${activationRecord}`)
            registerState.isAlreadActivated = true
            // console.log(`status after update line uid ${registerState.isAlreadActivated}`)

        }

        if (registerState.isWriteLineUid === true && registerState.isAlreadActivated === true) {
            return true
        }
        return false
    }


}   



// const register = async (token, lineUid) => {
//     console.log(`token in register : ${token}`)
//     console.log(`lineUid in regiser : ${lineUid}`)
//     const userId = jwt.verifyToken(token)
//     userId.then(async userid => {
//         if (userid) {
//             // edit lineUid in employee table with userId
//             const result = {
//                 isWriteLineUid : false,
//                 isAlreadActivated : false
//             }
//             let employeeRecord = await employeeRepository.findOneEmployee(userid)
//             if (employeeRecord) {
//                 employeeRecord = JSON.parse(JSON.stringify(employeeRecord, null, 2))
//                 employeeRecord.lineUid = lineUid
//                 console.log(employeeRecord)
//                 await employeeRepository.update(userid, employeeRecord)
//                 result.isWriteLineUid = true
//             }

//             // edit activations table to record isUsed to true
//             let activationRecord = await registerRepository.findTokenByUserId(userid)
//             if (activationRecord) {
//                 activationRecord = JSON.parse(JSON.stringify(employeeRecord, null, 2))
//                 activationRecord.isUsed = true
//                 const result = await registerRepository.updateTokenUsed(activationRecord.id, activationRecord)
//                 console.log(`update code status : ${activationRecord}`)
//                 result.isAlreadActivated = true

//             }

//             if (result.isWriteLineUid && result.isAlreadActivated) {
//                 return true
//             }
//             return false
//         }
//     }).catch(err => {
//         console.log(err)
//     })

// }

module.exports = {
    isEmployee,
    register
}