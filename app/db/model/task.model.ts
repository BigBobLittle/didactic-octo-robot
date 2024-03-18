// task.model.ts
import mongoose, { Schema, Document, Model } from 'mongoose';



/**
 * Interface representing a task document in the database.
 *
 * @property {string} name - The name of the task.
 * @property {string} description - The description of the task.
 * @property {string} id - The unique identifier of the task.
 */
export interface Task extends Document {
  // The name of the task.
  name: string;
  
  // The description of the task.
  description: string;
  
  // The unique identifier of the task.
  id: string;
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  
},{
  timestamps: true
});

const TaskModel: Model<Task> = mongoose.models.Task || mongoose.model<Task>('Task', TaskSchema);
export  {TaskModel}
