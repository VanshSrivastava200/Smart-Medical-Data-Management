import mongoose from "mongoose";
const doctorSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    specialization:{
        type:String,
        required:true,
        trim:true
    },
    license:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
},{timestamps:true})

const Doctor=mongoose.model('Doctor',doctorSchema);
export default Doctor;