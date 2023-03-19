const fs = require('fs')
const path = require('path')




const removeFile =  (fileName) => {
    const pathFileforRemove = path.resolve(__dirname,`../../files/${fileName}.jpg`)
    return new Promise((resolve, reject) => {
        try {
            fs.unlinkSync(pathFileforRemove)
            resolve(true)
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    removeFile
}