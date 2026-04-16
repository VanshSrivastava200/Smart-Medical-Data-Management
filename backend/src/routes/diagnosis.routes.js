import express from 'express'
import {setDiagnosis} from "../controllers/diagnosis.controller.js"

const router=express.Router()

router.post('/setdiagnosis',setDiagnosis)

export default router;