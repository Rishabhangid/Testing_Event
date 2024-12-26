const mongoose = require("mongoose");
const config = require("./config.js");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
const connectDB = () => {
    console.log(config.mongoose.url, "---------------config.mongoose.url---------------");
    mongoose.connect(config.mongoose.url,{autoIndex: true})
        .then(() => console.log("Connected to DB at", config.mongoose.url))
        .catch((e) => console.log("Failed to connect to DB", config,e));
}

module.exports = connectDB;