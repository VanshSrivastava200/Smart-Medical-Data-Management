import mongoose from "mongoose";
const labSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
    },
},{timestamps:true})

const Lab=mongoose.model('Lab',labSchema);
export default Lab;