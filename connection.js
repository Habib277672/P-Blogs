const mongoose = require('mongoose')

let isConnected = false;

const connectMongoDB = async (url) => {
    if (isConnected) {
        console.log("Using existing MongoDB connection")
        return;
    }

    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        isConnected = true;
        console.log("MongoDB Connected Successfully")
    } catch (err) {
        console.log("MongoDB Connection Error:", err)
        throw err;
    }
}

module.exports = { connectMongoDB }