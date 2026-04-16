import mongoose from "mongoose";
const facilitySchema=new mongoose.Schema({
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
    doctors:[{
        type:String,
    }]
},{timestamps:true})

const Facility=mongoose.model('Facility',facilitySchema);
export default Facility;