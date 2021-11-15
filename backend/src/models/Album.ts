module.exports = (sequelize: any, DataTypes: any) => {
  const Album = sequelize.define('album', {
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
    creator: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  Album.associate = (models: any) => {
    Album.belongsTo(models.user, { foreignKey: 'creator' });
    Album.belongsTo(models.group, { foreignKey: 'groupId' });
  };

  return Album;
};
