const express = require('express')
const app = express()
const fs = require('fs');
const { default: mongoose } = require('mongoose');
const router = require('./src/router');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;


//middleware
app.use(cors())
app.use(express.json());


app.use('/api', router)

//db connection
const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/chatapp')
        console.log("DB is connected")
    } catch (error) {
        console.log('DB is not connected')
        console.error(error)
    }
}

dbConnection();



app.get('/', (req, res) => {
    fs.readFile('./pages/index.html', (err, data) => {
        if (err) {
            console.error(err)
        } else {
            res.write(data);
            res.end()
        }
    })
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})