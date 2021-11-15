module.exports = (sequelize: any, DataTypes: any) => {
  const Group = sequelize.define('group', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    groupPicture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    memberCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    owner: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  Group.accociate = (models: any) => {
    Group.belongsTo(models.user, { foreignKey: 'owner' });
  };

  return Group;
};
