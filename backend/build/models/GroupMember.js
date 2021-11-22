"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const groupMemberRoles_1 = require("../constants/groupMemberRoles");
module.exports = (sequelize, DataTypes) => {
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
            type: DataTypes.ENUM([groupMemberRoles_1.ROLE.SUPERADMIN, groupMemberRoles_1.ROLE.ADMIN, groupMemberRoles_1.ROLE.MEMBER]),
            allowNull: false,
            defaultValue: groupMemberRoles_1.ROLE.MEMBER,
        },
    });
    GroupMember.accociate = (models) => {
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
