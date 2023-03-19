const employeeRepository = require('../repositories/employee.repository')

const findOnlyEmployeeRegistered = async () => await employeeRepository.findOnlyEmployeeRegistered()

module.exports = {
    findOnlyEmployeeRegistered
}