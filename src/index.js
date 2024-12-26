
const main = require("./app");
const config = require("./config/config");
const connectDB = require("./config/database")
let server=config.port;

//updated
//Connect With DataBase
connectDB();

//Entry Point
main.listen(server, () => console.log("Listening at PORT:", server));