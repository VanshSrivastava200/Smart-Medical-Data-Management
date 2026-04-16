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