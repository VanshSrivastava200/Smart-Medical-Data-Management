import Diagnosis from "../models/diagnosis.js";

export const setDiagnosis = async (req, res) => {
    try {
        const { patientid, doctorid, facilityid, conditions, reason, precaution, medicines, tests } = req.body;

        const newDiagnosis = {
            patientid,
            doctorid,
            facilityid,
            conditions,
            reason,
            precaution,
            medicines,
            tests
        }

        await Diagnosis.create(newDiagnosis).then(
            res.status(200).json({message:"Diagnosis Saved"})
        )

    } catch (err) {
        res.status(400).json({message:err.message})
        console.log(err.message)
    }
}

export const getDiagnosis=async(req,res)=>{
    try{
        const diagnosis=await Diagnosis.findById(req.query.diagnosisId)
        const tests=diagnosis.tests.filter((element)=>{
            if(!element.result) return element;
        })
        console.log(tests)
        res.status(200).json(tests)
    }catch(err){
        res.status(404).json({message:"Not found"})
        console.log(err)
    }
}

export const getTest=async(req,res)=>{
    try{
        const test=await Diagnosis.findOne({"tests._id":req.query.testId},{ "tests.$": 1 })
        console.log(test)
        res.status(200).json({success:true, test})
    }catch(err){
        res.status(404).json({message:"Not found"})
        console.log(err)
    }
}

