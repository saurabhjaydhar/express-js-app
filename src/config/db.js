
import mongoose  from "mongoose";
// import dotenv from 'dotenv';

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((value) => {
      console.log(`mongoose connection done | ${value}`);
    })
    .catch((error) => {
      console.log(`mongoose connection failed | ${error}`);
    });
};
export default connectDB;

// module.exports = connectDB;