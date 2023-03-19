const { Employees, Activations, Groups, Managers } = require('../db/models')
const { Op } = require('sequelize')


Employees.hasOne(Groups, { foreignKey: "groupId", sourceKey: "groupId" })
Groups.belongsTo(Employees, { foreignKey: "groupId" })

Managers.hasMany(Groups, { foreignKey: "managerId", sourceKey: "managerId" })
Groups.belongsTo(Managers, { foreignKey: "managerId" })

Employees.hasOne(Managers, { foreignKey: "userId", sourceKey: "userId" })
Managers.belongsTo(Employees, { foreignKey: "userId", sourceKey: "userId" })

const getAllEmployees = async () => await Employees.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    order: [
        ['id', 'ASC']
    ]
})

const findOneEmployee  = async (userId) => await Employees.findOne({
    where : {
        userId
    }
})

const update = async (userId, item) => await Employees.update(item, {
    where: {
        userId
    }
})


const findByUserId = async (userId) => await Employees.findOne({
    where : {
        userId
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
        {
            model: Groups,
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
            include: [
                {
                    model: Managers,
                    attributes: { exclude: ["id","userId","createdAt", "updatedAt"] },
                    include: [
                        {
                            model: Employees,
                            attributes: { exclude: ["id", "createdAt", "updatedAt"] }

                        }
                    ]
                }
            ]

        }
    ],
    order: [
        ['id', 'ASC']
    ]
})

Employees.hasOne(Activations, { foreignKey: "userId", sourceKey: "userId" })
Activations.belongsTo(Employees, { foreignKey: "userId" })

const getUserbyRegisterKey = async (key) => await Employees.findOne({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
        {
            model: Activations,
            where: {
                registerKey: key,
                isUsed: false
            },
            attributes: { exclude: ["createdAt", "updatedAt"] }
        }
    ],

})


const findUserByLineUid = async (lineUid) => await Employees.findOne({
    where : {
        lineUid
    }
})


const findAll = async () => await Employees.findAll()

const findOnlyEmployeeRegistered = async () => await Employees.findAll({
    where : {
        lineUid: {
            [Op.not]: null,
            [Op.not]: ''
        }
    }
})


    


const insert = async (data) => await Employees.bulkCreate(data)

module.exports = {
    getAllEmployees,
    getUserbyRegisterKey,
    insert,
    findByUserId,
    findUserByLineUid,
    findOneEmployee,
    update,
    findAll,
    findOnlyEmployeeRegistered
}