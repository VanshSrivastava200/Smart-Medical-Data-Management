import express from "express"
import { getDoctor,getFacilities,getDiagnosis } from "../controllers/doctor.controller.js";
import authMiddleware from "../middleware/auth.middleware.js"

const router=express.Router()

router.get("/getdoctor",authMiddleware,getDoctor)
router.get("/getfacilities",authMiddleware,getFacilities)
router.get("/getdiagnosis",authMiddleware,getDiagnosis)

export default router
