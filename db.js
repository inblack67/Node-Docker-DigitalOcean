const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`Mongo is here`.blue.bold); 

    } catch (err) {
        console.error(`${err}`.red.bold);
    }
}


module.exports = connectDB;