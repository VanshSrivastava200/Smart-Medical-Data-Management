import Pharmacy from "../models/pharmacy.js"
import User from "../models/user.js"
export const pharmacyprofile = async (req, res) => {
    if (req.user.role == "PHARMACY") {
        const { address} = req.body
        const curruser = req.user.userid
        try {

            await Pharmacy.create({
                userid: curruser,
                address
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