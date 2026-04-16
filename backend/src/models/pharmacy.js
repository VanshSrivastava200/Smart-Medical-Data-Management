import mongoose from "mongoose";
const pharmacySchema=new mongoose.Schema({
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

const Pharmacy=mongoose.model('Pharmacy',pharmacySchema);
export default Pharmacy;