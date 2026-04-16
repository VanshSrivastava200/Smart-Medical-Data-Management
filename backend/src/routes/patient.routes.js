import express from 'express'
import {verifyPatient} from '../controllers/patient.controller.js'

const router=express.Router()

router.get("/verify",verifyPatient);

export default router;