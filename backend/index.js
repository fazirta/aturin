import express from "express"
import cors from "cors"

import dotenv from "dotenv"
dotenv.config();

import userRoutes from "./routes/userRoutes.js"
import incomeRoutes from "./routes/incomeRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"

const app = express();


app.use(cors())
app.use(express.json())
app.use(userRoutes)
app.use(incomeRoutes)
app.use(expenseRoutes)
app.use(categoryRoutes)

app.listen(process.env.APP_PORT, () => {
    console.log("Server up and running...")
})