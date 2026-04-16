import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db.js";

dotenv.config()
connectDB()

app.listen(3000,()=>{
    console.log("Server running on port 3000");
})