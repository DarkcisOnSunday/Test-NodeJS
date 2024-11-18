import express from 'express'
import routes from './routes'
require('dotenv').config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT

app.use('/', routes)

app.listen(PORT, () => console.log('SERVER STARTED ON PORT: ' + PORT))