import mongoose from 'mongoose'

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('database connnected successfully ✅ ')
    } catch (error) {
        console.log("database connection failed ❌",error)
    }
}

export default connectDB;