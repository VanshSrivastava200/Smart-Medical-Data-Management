import mongoose from "mongoose";
const labtestSchema=new mongoose.Schema({
    testid:{
        type:String,
        required:true,
    },
    labid:{
        type:String,
        required:true,
    },
    fileurl:{
        type:String,
        required:true,
    }
},{timestamps:true})

const LabTest=mongoose.model('LabTest',labtestSchema);
export default LabTest;