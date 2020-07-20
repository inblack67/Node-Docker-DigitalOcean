const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://ryuwaki:watari@files-axoui.mongodb.net/mongo-multer?retryWrites=true&w=majority', {
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