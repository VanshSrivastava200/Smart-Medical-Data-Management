import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    userid:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["DOCTOR","PATIENT","NURSE","FACILITY","LAB","PHARMACY"],
        require:true
    },
    profileCompleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const User=mongoose.model('User',userSchema);
export default User;