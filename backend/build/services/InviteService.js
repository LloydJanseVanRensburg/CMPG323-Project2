"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const EmailingServices_1 = require("./EmailingServices");
const db = require('../models');
class InviteService {
    static async sendInvites(emailInviteList, foundGroup) {
        return new Promise(async (resolve, reject) => {
            try {
                const cleanEmailList = [];
                for (let i = 0; i < emailInviteList.length; i++) {
                    // Check that user is registered
                    let email = emailInviteList[i];
                    const foundUser = await db.user.findOne({ where: { email: email } });
                    // Check user is registered else skip
                    if (!foundUser) {
                        continue;
                    }
                    // Check that user is not part of group already
                    const isMember = await db.groupmember.findOne({
                        where: {
                            memberId: foundUser.id,
                            groupId: foundGroup.id,
                        },
                    });
                    if (isMember) {
                        continue;
                    }
                    // Check that invite for user and group doesn't exists already
                    const foundGroupInvite = await db.groupinvite.findOne({
                        email: email,
                        groupId: foundGroup.id,
                    });
                    if (foundGroupInvite) {
                        await foundGroupInvite.destroy();
                    }
                    let inviteObj = {
                        userId: foundUser.id,
                        groupId: foundGroup.id,
                        email: foundUser.email,
                    };
                    cleanEmailList.push(inviteObj);
                }
                cleanEmailList.forEach(async (invite) => {
                    // Generate Custom Join URL and Message example <domain>/groups/:groupId/join?email=&groupId=&token=
                    let token = crypto_1.default.randomBytes(20).toString('hex');
                    let baseURL = process.env.FRONTEND_URL;
                    let customURL = `groups/${foundGroup.id}/join?email=${invite.email}&token=${token}`;
                    let joinLink = `${baseURL}/${customURL}`;
                    // Generate Custom HTML email template
                    let message = `
            <h1>You have received an group invitation to ${foundGroup.title}</h1>
            <p>Click on the link below to join</p>
            <a href="${joinLink}" clicktracking=off>Join Group</a>
          `;
                    // Add to groupInvite class
                    await db.groupinvite.create({
                        email: invite.email,
                        groupId: invite.groupId,
                        token: token,
                    });
                    // Send Email
                    EmailingServices_1.EmailServices.sendEmail({
                        to: invite.email,
                        subject: `Group Invite From ${foundGroup.title}`,
                        text: message,
                    });
                });
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.InviteService = InviteService;
