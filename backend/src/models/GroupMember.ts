import mongoose from 'mongoose';

const groupMemberSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
  },
  { timestamps: true }
);

const GroupMember = mongoose.model('GroupMember', groupMemberSchema);

export default GroupMember;
