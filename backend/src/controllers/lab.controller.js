import Lab from "../models/lab.js"
import User from "../models/user.js"
import Diagnosis from "../models/diagnosis.js"

export const labprofile = async (req, res) => {
    if (req.user.role == "LAB") {
        const { address } = req.body
        const curruser = req.user.userid
        try {
            await Lab.create({
                userid: curruser,
                address
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

export const getLab = async (req, res) => {

    try {
        const currLab = await Lab.findOne({ userid: req.user.userid })

        if (!currLab) {
            return res.status(404).json({ message: "Lab not found" });
        }
        res.json(currLab);
    } catch (err) {
        res.status(400).json({ message: err.message })
        console.log(err)
    }
}

export const uploadResults = async (req, res) => {
    try {
        const { testId, result, notes, labid } = req.body


        await Diagnosis.updateOne(
            { "tests._id": testId },
            {
                $set: {
                    "tests.$.result": result,
                    "tests.$.notes": notes,
                    "tests.$.labid": labid
                }
            }
        );

        res.status(200).json({message:"Upoaded successfully"})
    

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "Failed to upload test" })
    }
}