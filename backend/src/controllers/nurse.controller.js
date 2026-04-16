import Nurse from "../models/nurse.js"
import User from "../models/user.js"
export const nurseprofile = async (req, res) => {
    if (req.user.role == "NURSE") {
        const { license } = req.body
        const curruser = req.user.userid
        try {

            await Nurse.create({
                userid: curruser,
                license
            })
            res.status(200).json({ success:true })
            await User.updateOne({userid:curruser},{profileCompleted:true})

        } catch (err) {
            res.status(500).json({ message: err.message })
            console.log(err)
        }
    } else {
        res.status(400).json({ message: "Not Authorized" })
    }
}