import mongoose from 'mongoose'
import config from './config.js'

const connectDB = async () => {
    try{ 
        mongoose.connection.on("connected", () => {
            console.log("Database connected successfully")
        })
        
        const projectName = 'resume-builder'
        let mongodbURI = config.mongodbURI

        if(!mongodbURI) {
            throw new Error("MongoDB_URI not set")
        }

        if(mongodbURI.endsWith('/')) {
            mongodbURI = mongodbURI.slice(0, -1)
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`)
    } catch (error) {
        console.error("Error connecting to Mongo DB: ", error)
    }
}

export default connectDB