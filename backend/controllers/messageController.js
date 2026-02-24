import Message from "../models/Message.js";

// Get all messages for a specific conversation
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        
        const messages = await Message.find({ conversationId })
            .populate("sender", "username email avatar") // Get sender details
            .sort({ createdAt: 1 }); // Oldest first

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};