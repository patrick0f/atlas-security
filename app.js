const express = require("express")
const app = express();
const port = process.env.PORT || 3001;
const scores = require("./routes/scores")
const connectDB = require("./db/connect")
require('dotenv').config()
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"))

// Routes
app.use('/api/v1/scores', scores)

app.use(notFound);
app.use(errorHandlerMiddleware);

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