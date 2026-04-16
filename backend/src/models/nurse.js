import mongoose from "mongoose";
const nurseSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    license:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
},{timestamps:true})

const Nurse=mongoose.model('Nurse',nurseSchema);
export default Nurse;