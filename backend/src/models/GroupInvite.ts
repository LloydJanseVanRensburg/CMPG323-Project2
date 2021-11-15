module.exports = (sequelize: any, DataTypes: any) => {
  const GroupInvite = sequelize.define('groupinvite', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  GroupInvite.accociate = (models: any) => {
    GroupInvite.belongsTo(models.group, { foreignKey: 'groupId' });
  };

  return GroupInvite;
};
