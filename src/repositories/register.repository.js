const { Activations } = require('../db/models')


const findByToken = async (token) => await Activations.findOne({
    where: {
        registerKey: token
    }
})

const updateTokenUsed = async (id, item) => await Activations.update(item, {
    where : {
        id
    }
})

const findTokenByUserId = async (userId) => await Activations.findOne({
    where : {
        userId
    }
})


module.exports = {
    findByToken,
    findTokenByUserId,
    updateTokenUsed
}