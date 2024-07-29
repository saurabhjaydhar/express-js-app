// const express = require ('express');
import express from 'express';
import dotenv from 'dotenv';
import authRouter from './src/routes/auth-route.js'
import connectDB from './src/config/db.js';

dotenv.config({ path: 'src/config/.env' });
connectDB();
const app = express();
const PORT= process.env.PORT||7000;
app.get('/',(req, res)=>{
  res.send('Testing is complete ')
});

app.use(`/api/auth`, authRouter);
app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
})