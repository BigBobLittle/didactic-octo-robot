import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the User document
/**
 * The User interface represents a document in the MongoDB collection.
 * Each document represents a user and has the following properties:
 * - email: The email of the user.
 * - password: The hashed password of the user.
 * - id: The unique identifier of the user.
 */
export interface User extends Document {
  // The email of the user.
  email: string;
  // The hashed password of the user.
  password: string;
  // The unique identifier of the user.
  id: string;
}

// Define the schema for the User document
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
},{
  timestamps: true
});

// Check if the model has been defined before creating it
const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

// Export the model
export { UserModel };
