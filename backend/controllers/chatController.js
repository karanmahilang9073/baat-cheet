import Conversaton from '../models/Conversation.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

// Get all users (for selecting chat members)
export const getUsers = async(req, res) => {
    try {
        const currentUserId = req.user.userId
        // Get all users except current user, exclude password
        const users = await User.find({ _id: { $ne: currentUserId } }).select('-password')
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: "error fetching users", error: error.message})
    }
}

export const getConversation = async(req,res)=>{
    try {
        const userId = req.user.userId;
        const conversation = await Conversaton.find({members : {$in : [userId]}})
        .populate("members")
        .populate("latestMessage")
        .sort({updatedAt : -1})
        res.status(200).json(conversation)
    } catch (error) {
        res.status(500).json({message : "error fetching conversation", error : error.message})
    }
}

export const createConversation = async(req,res)=>{
    try {
        const userId = req.user.userId
        const {name, members, isGroup} = req.body

        if (!members || !Array.isArray(members)) {
            return res.status(400).json({message : "members array is required"})
        }

        // Validate and convert member IDs to ObjectIds
        const validatedMembers = members.map(memberId => {
            if (!mongoose.Types.ObjectId.isValid(memberId)) {
                throw new Error(`Invalid member ID: ${memberId}`)
            }
            return new mongoose.Types.ObjectId(memberId)
        })

        // Add current user if not already included
        const userObjectId = new mongoose.Types.ObjectId(userId)
        if (!validatedMembers.some(m => m.equals(userObjectId))) {
            validatedMembers.push(userObjectId)
        }

        if (isGroup) {
            if (!name || !name.trim()) {
                return res.status(400).json({message: "Group name is required for group chats"})
            }
            const conversation = await Conversaton.create({name, members: validatedMembers, isGroup, createdBy: userObjectId})
            const populatedConversation = await Conversaton.findById(conversation._id)
                .populate("members", "-password")
            return res.status(200).json(populatedConversation)
        } else {
            if (validatedMembers.length !== 2) {
                return res.status(400).json({message: "1-on-1 chat requires exactly 2 members"})
            }
            const existingConversation = await Conversaton.findOne({
                isGroup: false, 
                members: {$all: validatedMembers, $size: 2}
            }).populate("members", "-password")
            
            if (existingConversation) {
                return res.status(200).json(existingConversation)
            }

            const conversation = await Conversaton.create({
                members: validatedMembers, 
                isGroup: false, 
                createdBy: userObjectId
            })

            const populatedConversation = await Conversaton.findById(conversation._id)
                .populate("members", "-password")
            return res.status(200).json(populatedConversation)
        }
    } catch (error) {
        console.error("CREATE CONVERSATION ERROR:", error)
        res.status(400).json({message: error.message || "failed to create conversation"})
    }
}