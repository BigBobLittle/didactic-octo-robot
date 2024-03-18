import mongoose from "mongoose";
import { UserModel } from "./user.model";


/**
 * Connects to the MongoDB database using the provided connection string.
 * If successful, it creates a dummy test user.
 * If there is an error, it logs the error message and exits the process.
 */
const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the provided connection string
    await mongoose.connect(`${process.env?.MONGODB_URI}`);
    
    // Create a dummy test user
    await createDummyUser();
  } catch (error) {
    // Log the error message and exit the process
    console.log(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

// create dummy test user 
const createDummyUser = async () => {
  const user = new UserModel({
    username: "test@test.com",
    password: "password",
  });
  await user.save();
}
export default connectDB;
