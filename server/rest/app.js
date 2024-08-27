import express from 'express'
import routes from './routes.js'
import dotenv from 'dotenv'
import cors from 'cors'


dotenv.config()
const app = express()
app.use(cors({ origin: process.env.REST_CORS_WHITELIST }));
app.use(routes)

const port = process.env.REST_PORT

app.listen(port, () => {
  console.log(`Server is running on http://${process.env.REST_HOST}:${port}`)
})