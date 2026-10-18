import express from 'express'
import {getLab,uploadResults,getHistory,verifyTest} from "../controllers/lab.controller.js"
import authMiddleware from '../middleware/auth.middleware.js'
const router=express.Router()

router.get('/getlab',authMiddleware,getLab)
router.get('/verifytest',authMiddleware,verifyTest)
router.post('/upload',authMiddleware,uploadResults)
router.get('/gethistory',authMiddleware,getHistory)

export default router;