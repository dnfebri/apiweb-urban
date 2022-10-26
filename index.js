import express from "express";
import cors from "cors";
// import session from "express-session";
// import SequelizeStore from "connect-session-sequelize";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import FileUpload from "express-fileupload";

import indexRoute from "./routes/index.js";

// const sessionStore = SequelizeStore(session.Store);
// const store = new sessionStore({
//   db: db
// })

// // ## Generate database tables
import db from "./config/Database.js";
const runDb = async() => {
  await db.authenticate();
  console.log("databases Connected...");
  await db.sync();
  // store.sync();
}
// try {
//   runDb();
// } catch (error) {
//   console.error(error);
// }

dotenv.config();

const app = express();

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   store: store,
//   cookie: {
//     secure: "auto"
//   }
// }));

app.use(cookieParser())
app.use(cors(
  {
    credentials: true,
    // origin: "*"
    origin: "*",
    preflightContinue: true
  }
));
// app.use(function(req, res, next) {
//   // res.setHeader("Access-Control-Allow-Origin", "*");
//   // res.setHeader("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
//   // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
//   res.header('Content-Type', 'application/json');
//   next();
// });
app.use(FileUpload())
app.use(express.json());
app.use(express.static('public'));
app.use(indexRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up port '" + process.env.APP_PORT + "' and running ...");
});