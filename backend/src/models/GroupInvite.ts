import mongoose from 'mongoose';

const groupInviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const GroupInvite = mongoose.model('GroupInvite', groupInviteSchema);

export default GroupInvite;
