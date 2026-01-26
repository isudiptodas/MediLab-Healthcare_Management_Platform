import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongo_uri = process.env.MONGODB_URI;

  try{
    await mongoose.connect(mongo_uri);
    console.log("Database connected");
  }
  catch(err){
    console.log(`Error occured -> `, err);
  }
}
