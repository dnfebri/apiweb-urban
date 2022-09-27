import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

import indexRoute from "./routes/index.js";

// // ## Generate database tables
// import db from "./config/Database.js";
// try {
//   await db.authenticate();
//   await db.sync();
//   console.log("databases Connected...");
// } catch (error) {
//   console.error(error);
// }

dotenv.config();

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // store: store,
  cookie: {
    secure: "auto"
  }
}));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3001'
}));
app.use(express.json());
app.use(indexRoute);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up port '" + process.env.APP_PORT + "' and running ...");
});