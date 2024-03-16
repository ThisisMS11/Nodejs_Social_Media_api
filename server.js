import express, { json } from 'express';
import { config } from 'dotenv';
const app = express();
import cors from 'cors';
import connectDB from './config/connectDB.js';
config({ path: './config/config.env' })

const PORT = process.env.PORT || 8000

/* importing routes here */
import user from './routes/user.js';
import post from './routes/post.js';

app.use(json());
app.use(cors());

connectDB();

app.get('/',(req,res)=>{
    res.send("Welcome to Social Media API By Mohit Saini")
})

app.use('/api/v1/user', user);
app.use('/api/v1/post', post);

app.listen(PORT, () => {
    console.log("Server listening ... at port : ", PORT);
})

export default app;