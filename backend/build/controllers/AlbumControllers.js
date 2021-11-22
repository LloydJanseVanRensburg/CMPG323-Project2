"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumControllers = void 0;
const BaseException_1 = require("../modules/BaseException");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const requestValidations_1 = require("../utils/requestValidations");
const db = require('../models');
class AlbumControllers {
    static async getAllGroupAlbums(req, res, next) {
        try {
            if (!(0, requestValidations_1.validateGetGroupAlbumBody)(req.body)) {
                next(BaseException_1.BaseException.invalidRequestBody());
                return;
            }
            const { groupId } = req.body;
            const foundGroupAlbums = await db.album.findAll({ where: { groupId } });
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                count: foundGroupAlbums.length,
                data: foundGroupAlbums,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            const {} = req.body;
            const albums = await db.album.findAll();
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                count: albums.length,
                data: albums,
            });
        }
        catch (error) {
            console.trace(error);
            next(error);
        }
    }
    static async createAlbum(req, res, next) {
        try {
            if (!(0, requestValidations_1.validateCreateAlbumBody)(req.body)) {
                next(BaseException_1.BaseException.invalidRequestBody());
                return;
            }
            // @ts-ignore
            const { id: userId } = req.user;
            const { groupId, title, description, color } = req.body;
            // Check that group exists
            const foundGroup = await db.group.findByPk(groupId);
            if (!foundGroup) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Check that group member exists
            const foundGroupMember = await db.groupmember.findOne({
                where: {
                    memberId: userId,
                    groupId,
                },
            });
            if (!foundGroupMember) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            const newAlbum = await db.album.create({
                title,
                description,
                creator: userId,
                groupId,
                color,
            });
            res.status(httpStatusCodes_1.httpStatusCode.CREATED).json({
                success: true,
                data: newAlbum,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const { albumId } = req.params;
            const foundAlbum = await db.album.findByPk(albumId);
            if (!foundAlbum) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                data: foundAlbum,
            });
        }
        catch (error) {
            console.trace(error);
            next(error);
        }
    }
    static async updateById(req, res, next) {
        try {
            if (!(0, requestValidations_1.validateUpdateAlbumBody)(req.body)) {
                next(BaseException_1.BaseException.invalidRequestBody());
                return;
            }
            const { albumId } = req.params;
            const { title, description } = req.body;
            // @ts-ignore
            const { id: userId } = req.user;
            // Check that album exists
            const foundAlbum = await db.album.findByPk(albumId);
            if (!foundAlbum) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Check that user is album creator
            if (foundAlbum.creator !== userId) {
                next(BaseException_1.BaseException.notAllowed());
                return;
            }
            if (title)
                foundAlbum.title = title;
            if (description)
                foundAlbum.description = description;
            const updatedAlbum = await foundAlbum.save();
            res.status(httpStatusCodes_1.httpStatusCode.CREATED).json({
                success: true,
                data: updatedAlbum,
            });
        }
        catch (error) {
            console.trace(error);
            next(error);
        }
    }
    static async deleteById(req, res, next) {
        try {
            const { albumId } = req.params;
            // @ts-ignore
            const { id: userId } = req.user;
            const foundAlbum = await db.album.findByPk(albumId);
            if (!foundAlbum) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            if (foundAlbum.creator !== userId) {
                next(BaseException_1.BaseException.notAllowed());
                return;
            }
            await foundAlbum.destroy();
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                data: null,
                message: 'Successfully deleted',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AlbumControllers = AlbumControllers;
