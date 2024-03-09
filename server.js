const express = require('express')
const dotenv = require('dotenv')
const app = express();
const cors = require('cors');
const connectDB = require('./config/connectDB')
dotenv.config({ path: './config/config.env' })

const PORT = process.env.PORT || 8000

/* importing routes here */
const user = require('./routes/user');
const post = require('./routes/post')

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/v1/user', user);
app.use('/api/v1/post', post);

app.listen(PORT, () => {
    console.log("Server listening ... at port : ", PORT);
})