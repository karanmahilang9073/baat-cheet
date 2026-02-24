import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username : {type : String, required : true, trim : true, minlength : 3},
    email : {type : String, unique : true,  required : true, lowercase : true, match : [/.+@.+\..+/,"please enter a valid email"]},//regex prevents duplicate
    password : {type : String, required : true, minlength : 6},
    avatar : {type : String}
}, {timestamps : true})

const User = mongoose.model("User",userSchema)

export default User;