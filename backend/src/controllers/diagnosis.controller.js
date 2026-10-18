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
        for(let i=0;i<newDiagnosis.tests.length;i++){
            newDiagnosis.tests[i].testid=generateTestId();
        }
        await Diagnosis.create(newDiagnosis)
        return res.status(200).json({message:"Diagnosis Saved"})

    } catch (err) {
        res.status(400).json({message:err.message})
        console.log(err.message)
    }
}

function generateTestId() {
  return String(
    Math.floor(1000000000 + Math.random() * 9000000000)
  );
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

export const getTest = async (req, res) => {
    try {
        const { testId } = req.query;
        
        const diagnosis = await Diagnosis.findOne(
            { "tests._id": testId },
            { "tests.$": 1 }
        );
        
        if (!diagnosis || !diagnosis.tests || diagnosis.tests.length === 0) {
            return res.status(404).json({ success: false, message: "Test not found" });
        }
        
        const test = diagnosis.tests[0];
        
        res.status(200).json({ 
            success: true, 
            test: {
                _id: test._id,
                type: test.type,
                testid: test.testid,
                result: test.result,
                notes: test.notes
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
}
