
const main = require("./app");
const config = require("./config/config");
const connectDB = require("./config/database")
const path = require("path")
let server = config.port;


//updated
//Connect With DataBase
connectDB();

//Entry Point
// main.listen(server, () => console.log("Listening at PORT:", server));
main.listen(server, () => {
  console.log("Listening at PORT:", server)
  console.log('Static files are being served from:');
  console.log('EventBookings:', path.join(__dirname, 'uploads', 'eventBookings'));
  console.log('EventDetails:', path.join(__dirname, 'uploads', 'eventDetails'));
  console.log('QrCode:', path.join(__dirname, 'uploads', 'qrCode'));
});