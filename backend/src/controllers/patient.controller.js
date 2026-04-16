import Patient from "../models/patient.js"
import User from "../models/user.js"
export const patientprofile = async (req, res) => {
    if (req.user.role == "PATIENT") {
        const { age, gender, bloodg, allergies } = req.body
        const curruser = req.user.userid
        try {

            await Patient.create({
                userid: curruser,
                age,
                gender,
                bloodg,
                allergies
            })
            res.status(200).json({ success: true })
            await User.updateOne({ userid: curruser }, { profileCompleted: true })

        } catch (err) {
            res.status(500).json({ message: err.message })
            console.log(err)
        }
    } else {
        res.status(400).json({ message: "Not Authorized" })
    }
}

export const verifyPatient = async (req, res) => {
    try {
        const userid = req.query.userid;
        const patient = await Patient.findOne({ userid })
        if (!patient) {
            res.status(400).json({ exists: false })
        }
        console.log(patient)
        res.status(200).json({ exists: true, patient })
    } catch (error) {
        res.status(500).json({ exists: false})
    }
}