import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js"
import profileRoutes from "./src/routes/profilecomplete.routes.js"
import doctorRoutes from "./src/routes/doctor.routes.js"
import patientRoutes from "./src/routes/patient.routes.js"
import diagnosisRoutes from "./src/routes/diagnosis.routes.js"
import labRoutes from "./src/routes/lab.routes.js"

const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:3000","http://localhost:5173"],
    credentials:true
}))
app.use("/auth",authRoutes)
app.use("/profilecomplete",profileRoutes)
app.use("/doctor",doctorRoutes)
app.use("/patient",patientRoutes)
app.use("/diagnosis",diagnosisRoutes)
app.use("/lab",labRoutes)

export default app;