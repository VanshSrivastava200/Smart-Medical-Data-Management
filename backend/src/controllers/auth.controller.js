import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//token creation
const createToken = (user) => {
    return jwt.sign(
        { userid: user.userid, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )
}

//register
export const register = async (req, res) => {

    try {
        const { userid, name, email, password,role, profileCompleted } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: "User already exists" })

        const hashedPw = await bcrypt.hash(password, 10)

        const user = await User.create({
            userid,
            password: hashedPw,
            email,
            name,
            role,
            profileCompleted: false
        })

        const token = createToken(user)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax"
        })

        res.status(201).json({
            message: "Register successfully",
            role: user.role,
            profileCompleted: user.profileCompleted
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err)
    }
}


//login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = createToken(user)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
        })

        res.json({
            message: "Login successful",
            role: user.role,
            profileCompleted: user.profileCompleted,
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//logout
export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};


//getuser
export const getMe = async (req, res) => {
    const curruser = await User.findOne({ userid: req.user.userid })
        .select("-password");

    if (!curruser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(curruser);
};