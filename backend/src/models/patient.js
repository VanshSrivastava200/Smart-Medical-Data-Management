import mongoose from "mongoose";
const patientSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    age:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    bloodg:{
        type:String,
        required:true,
    },
    allergies:[{
        type:String,
        required:true,
    }],
},{timestamps:true})

const Patient=mongoose.model('Patient',patientSchema);
export default Patient;