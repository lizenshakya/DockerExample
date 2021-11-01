const express = require('express');
const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, SESSION_SECRET, REDIS_URL, REDIS_PORT } = require('./config/config');
const session = require('express-session')
const redis = require('redis')
const cors = require('cors')
let RedisStore = require("connect-redis")(session)

let redisClient = redis.createClient({
    host: REDIS_URL,
    post: REDIS_PORT 
})
const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")
const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose.connect(mongoURL, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log("mongo connected:::::::::::::::::::::::::"))
    .catch((error) => {
     console.log(error),
     setTimeout(connectWithRetry, 5000)
    });
}

connectWithRetry();
app.use(cors({}))
app.enable("trust proxy");
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 300000
    }

}))
app.use(express.json());
app.get("/api", (req, res) => {
    res.send("<h2>Hi There!!! </h2>")
})

app.use("/v1/post", postRouter)
app.use("/v1/users", userRouter)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`))