import  express  from "express"; // we use this by instend of "const express = require('express')" for using like this we need to add <"type": "module"> in package.json
import dotenv from "dotenv"
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"
import usersRoute from "./routes/users.js"
import cookiePaser from "cookie-parser"
import cors from "cors"

const app = express()

dotenv.config()

const connect = async() => {
    try { 
        await mongoose.connect(process.env.MONGO)
        console.log("connected to mongoDB")
    } catch (error) {
        throw error
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB Disconnected")
})

//middlewares
app.use(cors())
app.use(cookiePaser())
app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/hotels', hotelsRoute)
app.use('/api/rooms', roomsRoute)
app.use('/api/users', usersRoute)

app.use((err, req, res, next) =>  {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Somthing went wrong!"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})

app.listen(8800, () => {
    connect()
    console.log("connected to backend")
})