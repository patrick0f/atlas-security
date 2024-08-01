require('dotenv').config()
require("express-async-errors")
const express = require("express")
const app = express();

const connectDB = require("./db/connect")
const authenticateUser = require("./middleware/authentication")
const authRouter = require('./routes/auth')
const scores = require("./routes/scores")

const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");


// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/scores', authenticateUser, scores)

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8080;

const start = async () => {
    try {
        await connectDB(process.env.uri)
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    }
    catch (err) {
        console.error(err)
    }
}

start()