import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'


export const register = async(req,res) =>{
    try {
        const {username, email, password, avatar} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message : "all fields must be provided"})
        }

        if (password.length < 6) {
            return res.status(400).json({message : "password must be at least 6 characters"})
        }

        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message : "user already exists"})
        }

        const hashedpassword = await bcrypt.hash(password,10)

        const user = await User.create({username, email, password : hashedpassword, avatar})

        const token = JWT.sign(
            {userId : user._id},
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        )

        //remove password from the response 
        const {password:_, ...userData} = user._doc;///It removes the password field from user._doc and stores all remaining user data in userData so the password isn’t sent to the client.

        res.status(201).json({token, user : userData})
    } catch (error) {
        console.error('register error:', error)
        res.status(500).json({message : "server error"})
    }
}

export const login = async(req,res) =>{
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({message : "email and password are required"})
        }
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({message : "Invalid email or password"})
        }

        const ismatch = await bcrypt.compare(password, user.password)
        if (!ismatch) {
            return res.status(400).json({message : "Invalid email or password"})
        }

        const token = JWT.sign(
            {userId : user._id},
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        )

        //remove password from the response 
        const {password:_, ...userData} = user._doc;

        res.status(200).json({token, user : userData})
    } catch (error) {
        console.error('login error',error)
        res.status(500).json({message : "server error"})
    }
}