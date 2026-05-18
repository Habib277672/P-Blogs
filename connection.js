const mongoose = require('mongoose')

const connectMongoDB = async (url) => {
    return mongoose.connect(url).then(() => {
        console.log("MongoDB Connected Successfully")
    }).catch((err) => {
        console.log("Error While Connecting MongoDB:", err)
    })
}

module.exports = {
    connectMongoDB
}
