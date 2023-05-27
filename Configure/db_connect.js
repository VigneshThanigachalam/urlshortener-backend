import mongoose from "mongoose";

export const db_connect = async () => {
    const uri = process.env.MONGO_DB;
    try {
      const conn = mongoose.connect(uri);
      console.log("Database connected successfully");
    } catch (err) {
      console.log(err);
    }
  };