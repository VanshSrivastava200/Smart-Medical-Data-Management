import express from "express"
import { doctorprofile } from "../controllers/doctor.controller.js"
import { patientprofile } from "../controllers/patient.controller.js"
import { facilityprofile } from "../controllers/facility.controller.js"
import { nurseprofile } from "../controllers/nurse.controller.js"
import { pharmacyprofile } from "../controllers/pharmacy.controller.js"
import { labprofile } from "../controllers/lab.controller.js"

import authMiddleware from "../middleware/auth.middleware.js"

const router=express.Router()

router.post("/doctor",authMiddleware,doctorprofile)
router.post("/patient",authMiddleware,patientprofile)
router.post("/lab",authMiddleware,labprofile)
router.post("/nurse",authMiddleware,nurseprofile)
router.post("/pharmacy",authMiddleware,pharmacyprofile)
router.post("/facility",authMiddleware,facilityprofile)

export default router