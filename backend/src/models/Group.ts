import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    groupPicture: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Group = mongoose.model('Group', groupSchema);

export default Group;
