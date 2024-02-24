import mongoose, { Schema } from "mongoose";

//Name and Password for the User

const userSchema = new Schema({
    name : {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true, 
        index: true
    }, 
    password : {
        type : String, 
        required : true,
        select : false
    }
}, {timestamps: true});



export const User = mongoose.model("User", userSchema);