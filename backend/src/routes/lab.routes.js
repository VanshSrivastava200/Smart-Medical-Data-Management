import express from 'express'
import {getLab,uploadResults} from "../controllers/lab.controller.js"

const router=express.Router()

router.get('/getlab',getLab)
router.post('/upload',uploadResults)


export default router;