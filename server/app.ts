import express from 'express'
export const app = express()
import cors from 'cors'
import {Request, Response, NextFunction} from "express";
import errorHandler from "./middleware/error";
import userRoutes from './routes/userRoute'

// Middleware to parse JSON requests
app.use(express.json({ limit: '50mb' }))

// Middleware to handle body parsing for URL-encoded data
app.use(express.urlencoded({ extended: true }))

// Middleware to handle cookie parsing
import cookieParser from 'cookie-parser'
app.use(cookieParser())

// Middleware to handle CORS
app.use(cors({
  origin: process.env.ORIGIN?.split(',') || '*', // Allow requests from the specified origin(s) 
  credentials: true,
}))

// Testing route to verify that the server is running
app.get('/test', (req, res) => {
  res.send('Server is running!')
})

// Import and use the user routes
app.use('/api/v1/users', userRoutes)

// Unknown route handler for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
})

app.use(errorHandler)
