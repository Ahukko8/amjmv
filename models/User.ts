// models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: String, // This will store Clerk's userId
  name: String,
  email: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;