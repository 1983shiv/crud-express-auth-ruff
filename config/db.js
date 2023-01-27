const mongoose = require("mongoose");
// import { mongoose } from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connnect : ${conn.connection.host}`);
  } catch (err) {
    console.log("some error occured", err.message);
  }
};

// export default connectDB;
module.exports = connectDB;
