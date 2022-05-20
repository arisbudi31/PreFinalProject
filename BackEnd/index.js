const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")
dotenv.config()

const router = require('./src/router')

const corsOption = {
  exposedHeaders: 'authorization'
}

const app = express()
app.use(cors(corsOption))
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

const db = require('./src/config')
db.connect(err => {
  if (err) {
    console.log("error: ", err)
  }

  console.log(`database is connected, thread id: ${db.threadId}`)
})

app.use("/api", router.user_router)
app.use("/api", router.story_router)

app.get("/", (req, res) => {
  res.status(200).send("Welcome to express and mysql server")
})

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`API Running at PORT: ${port}`))