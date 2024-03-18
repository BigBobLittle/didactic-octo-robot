
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

import { Task } from '../../types/Tasks'; 
import {UserModel} from '../../db/model/user.model';
import {TaskModel} from '../../db/model/task.model';
import { createDummyUser } from '@/app/db/model/db';



const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    
    tasks: async (userId:string): Promise<Task[]> => {
      // fetch all tasks belonging to a user based on their id on the task 
      const tasks = await TaskModel.find({user: userId});
      return tasks; 
    },

    task: async (_parent: any, { input: { id } }: { input: { id: number } }): Promise<Task> => {
      const task = await TaskModel.findById(id).exec();
      if (!task) {
        throw new Error('Task not found');
      }
      return task
    }
    
  },
  Mutation: {
    login: async (
      _parent: any,
      { input: { email, password } }: { input: { email: string; password: string } }
    ): Promise<{ message: string; data: { token: string } }> => {
      try {

        // provide checks for email and password 
        if(!email ) {
          throw new Error('Please provide an email');
        }

        // regex for email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
          throw new Error('Please provide a valid email');
        }

        if(!password) {
          throw new Error('Please provide a password');
        }
        // Find user by email
        let  user
         user = await UserModel.findOne({ email })

        // If user doesn't exist, throw an error
        if (!user) {
          // throw new Error('User not found');
          // create a dummy user account just for testing 
         const newUser = await createDummyUser();
         const task = await TaskModel.create({name: 'test name', description: 'test description'})
        
          if(newUser && newUser._id ){

            user = newUser.toJSON();
          }
        }

       if(user){
         // Compare passwords
         const isPasswordValid = await bcrypt.compare(password, user.password)

         // If passwords don't match, throw an error
         if (!isPasswordValid) {
           throw new Error('Invalid username or password');
         }
 
         // Generate JWT token
         const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
 
         // Return the token
         return { message: 'Login successful',  data: { token } };
       }
       else{
        throw new Error('User not found');
       }
      } catch (error: any) {
      
        throw new Error(`Login failed: ${error.message}`);
      }
    },



    signup: async (_: undefined, { input: { email, password, confirmPassword } }: 
      { input: { email: string; password: string; confirmPassword: string } }): Promise<{message: string; data: { token: string }}>  => {
      try {

        // check for email, password and confirmPassword 
        if (!email || !password || !confirmPassword) {
          throw new Error('Please provide an email, password and confirm your Password');
        }

        // regex for email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
          throw new Error('Please provide a valid email');
        }
        // Check if passwords match
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({ email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '1h' });

        // Return the token
        return {message: "Signup successful", data:{token}};
      } catch (error: any) {

        if(error.code === 11000) {
          throw new Error('Email already exists');
        }
        
        throw new Error(`Signup failed: ${error.message}`);
      }
    },
  
    createTask: async (_: undefined, { input: { name, description } }: { input: { name: string; description: string } }): Promise<Task> => {
      
      // include checks for name and description
      if (!name || !description) {
        throw new Error('Name and description are required');
      }
      
      const task = await TaskModel.create({ name, description });
     
     return task
    
    },

    updateTask: async (_: undefined, { input: { id, name, description } }: { input: { id: string; name: string; description: string } }): Promise<Task> => {
      const task = await TaskModel.findByIdAndUpdate(id, { name, description }, { new: true }).exec();
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    },

    deleteTask: async (_: undefined, { input: { id } }: { input: { id: string } }): Promise<{ message: string; data: { token: string } }> => {
     
      const task = await TaskModel.findByIdAndDelete(id).exec();
      if (!task) {
        throw new Error('Task not found');
      }
     
      return {
        message: `Task ${id} deleted successfully`,
        data: { token: '' },
      };
    },

   
}
}

export default resolvers;




