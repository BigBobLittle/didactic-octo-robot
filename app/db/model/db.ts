import mongoose from "mongoose";
import { UserModel } from "./user.model";
import * as bcrypt from "bcryptjs";

/**
 * Connects to the MongoDB database using the provided connection string.
 * If successful, it creates a dummy test user.
 * If there is an error, it logs the error message and exits the process.
 */
const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the provided connection string
    await mongoose.connect(
      `${process.env?.MONGODB_URI || "mongodb://localhost:27017"}`
    );

    await createDummyUser()
  } catch (error) {
    // Log the error message and exit the process
    console.log(`Error connecting to MongoDB: ${error}`);
  }
};

// try creating a dummy user
const createDummyUser = async () => {
  try {
    // create a dummy test user
    const user = await UserModel.findOne({ email: "test@test.com" });
    if (user) {
      return;
    } else {
      const hashedPassword = await bcrypt.hash("password", 10);
      const user1 = UserModel.create({
        email: "test@test.com",
        password: hashedPassword,
      });

      console.log({ userCreated: JSON.stringify(user1) });
      return user1;
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export { connectDB, createDummyUser };
