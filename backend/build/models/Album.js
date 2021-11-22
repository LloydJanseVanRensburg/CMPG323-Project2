"use strict";
module.exports = (sequelize, DataTypes) => {
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
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    Album.associate = (models) => {
        Album.belongsTo(models.user, {
            foreignKey: 'creator',
            onDelete: 'CASCADE',
        });
        Album.belongsTo(models.group, {
            foreignKey: 'groupId',
            onDelete: 'CASCADE',
        });
    };
    return Album;
};
