import express from 'express'
import {setDiagnosis,getDiagnosis,getTest} from "../controllers/diagnosis.controller.js"

const router=express.Router()

router.post('/setdiagnosis',setDiagnosis)
router.get('/getdiagnosis',getDiagnosis)
router.get('/gettest',getTest)

export default router;