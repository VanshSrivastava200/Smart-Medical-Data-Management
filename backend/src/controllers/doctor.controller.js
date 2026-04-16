import Doctor from "../models/doctor.js"
import User from "../models/user.js"
import Facility from "../models/facility.js"
import Diagnosis from "../models/diagnosis.js"

export const doctorprofile = async (req, res) => {
    if (req.user.role == "DOCTOR") {
        const { specialization, license } = req.body
        const curruser = req.user.userid
        try {

            await Doctor.create({
                userid: curruser,
                specialization,
                license
            })
            res.status(200).json({ success:true })
            await User.updateOne({ userid: curruser }, { profileCompleted: true })

        } catch (err) {
            res.status(500).json({ message: err.message })
            console.log(err)
        }
    } else {
        res.status(400).json({ message: "Not Authorized" })
    }
}

export const getDoctor = async (req, res) => {

    try {
        const currDoctor = await Doctor.findOne({ userid: req.user.userid })

        if (!currDoctor) {
            return res.status(404).json({ message: "Doctor not found" });

        }
        res.json(currDoctor);
    } catch (err) {
        res.status(400).json({ message: err.message })
        console.log(err)
    }
}

export const getFacilities=async (req,res)=>{

    try{
        const facilities=await Facility.find({ doctors: req.user.userid })
        res.status(200).json(facilities)
    }catch(err){
        res.status(404).json({message:"Facilities Not found"})
        console.log(err)
    }
}

export const getDiagnosis=async(req,res)=>{
    
    try{
        const diagnosis=await Diagnosis.find({doctorid:req.user.userid})
        res.status(200).json(diagnosis)
    }catch(err){
        res.status(404).json({message:"Not found"})
        console.log(err)
    }
}

