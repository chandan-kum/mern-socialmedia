import  express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRout from "./router/AuthRout.js";
import UserRoute from "./router/UserRout.js"
import PostRout from "./router/PostRout.js"

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() =>app.listen(4000, () =>console.log("litning"))).catch((error) => console.log(error));

app.use('/auth', AuthRout);
app.use('/user', UserRoute)
app.use('/post', PostRout)