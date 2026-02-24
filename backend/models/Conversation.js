import mongoose from "mongoose";

const convoSchema = mongoose.Schema({
    name : {type : String, trim : true,
         required : function(){
            return this.isGroup; 
    }, 
    },
    members : [{type : mongoose.Schema.Types.ObjectId, ref : "User", required : true}],
    createdBy : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true },
    latestMessage : {type : mongoose.Schema.Types.ObjectId, ref : "Message"},
    isGroup : {type : Boolean, default : false}, // default to 1-on-1 chat
}, {timestamps : true})

const Conversation = mongoose.model("Conversation", convoSchema)

export default Conversation;