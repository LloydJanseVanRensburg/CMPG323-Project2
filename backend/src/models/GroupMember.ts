import { ROLE } from '../constants/groupMemberRoles';

module.exports = (sequelize: any, DataTypes: any) => {
  const GroupMember = sequelize.define('groupmember', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM([ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.MEMBER]),
      allowNull: false,
      defaultValue: ROLE.MEMBER,
    },
  });

  GroupMember.accociate = (models: any) => {
    GroupMember.belongsTo(models.group, {
      foreignKey: 'groupId',
      onDelete: 'CASCADE',
    });
    GroupMember.belongsTo(models.user, {
      foreignKey: 'memberId',
      onDelete: 'CASCADE',
    });
  };

  return GroupMember;
};
