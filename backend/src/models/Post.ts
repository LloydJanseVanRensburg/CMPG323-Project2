module.exports = (sequelize: any, DataTypes: any) => {
  const Post = sequelize.define('post', {
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
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    files: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    albumId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  Post.associate = (models: any) => {
    Post.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Post.belongsTo(models.album, {
      foreignKey: 'albumId',
      onDelete: 'CASCADE',
    });
  };

  return Post;
};
