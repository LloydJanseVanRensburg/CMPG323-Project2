import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: true,
      default: '', // Add in the default profile picutre imageKey save in S3
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
