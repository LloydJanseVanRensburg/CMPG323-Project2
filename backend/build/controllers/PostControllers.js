"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostControllers = void 0;
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const FileUploadMiddleware_1 = require("../middleware/FileUploadMiddleware");
const BaseException_1 = require("../modules/BaseException");
const ImageProcessing_1 = require("../services/ImageProcessing");
const deleteFiles_1 = require("../utils/deleteFiles");
const requestValidations_1 = require("../utils/requestValidations");
const db = require('../models');
class PostControllers {
    static async getAllAlbumPosts(req, res, next) {
        try {
            if (!(0, requestValidations_1.validateGetAlbumPostsBody)(req.body)) {
                next(BaseException_1.BaseException.invalidRequestBody());
                return;
            }
            const { albumId } = req.body;
            const foundAlbumPosts = await db.post.findAll({
                where: { albumId },
                order: [['createdAt', 'DESC']],
            });
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                count: foundAlbumPosts.length,
                data: foundAlbumPosts,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            const posts = await db.post.findAll();
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                data: posts,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            if (!(0, requestValidations_1.validateCreatePostBody)(req.body)) {
                next(BaseException_1.BaseException.invalidRequestBody());
                return;
            }
            const { albumId, title, body, files } = req.body;
            // @ts-ignore
            const { id: userId } = req.user;
            // Check that album exists
            const foundAlbum = await db.album.findByPk(albumId);
            if (!foundAlbum) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Check that user is group member
            const foundMember = await db.groupmember.findOne({
                where: {
                    memberId: userId,
                    groupId: foundAlbum.groupId,
                },
            });
            if (!foundMember) {
                next(BaseException_1.BaseException.notAllowed());
                return;
            }
            const newPost = await db.post.create({
                albumId,
                title,
                body,
                files,
                userId,
            });
            res.status(httpStatusCodes_1.httpStatusCode.CREATED).json({
                success: true,
                data: newPost,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const { postId } = req.params;
            const foundPost = await db.post.findByPk(postId);
            if (!foundPost) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                data: foundPost,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateById(req, res, next) {
        try {
            if (!(0, requestValidations_1.validateUpdatePostBody)(req.body)) {
                next(BaseException_1.BaseException.invalidRequestBody());
                return;
            }
            const { postId } = req.params;
            // @ts-ignore
            const { id: userId } = req.user;
            const { title, body, files } = req.body;
            const foundPost = await db.post.findByPk(postId);
            if (!foundPost) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Check that album exists
            const foundAlbum = await db.album.findByPk(foundPost.albumId);
            if (!foundAlbum) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Check that user is group member
            const foundMember = await db.groupmember.findOne({
                where: {
                    memberId: userId,
                    groupId: foundAlbum.groupId,
                },
            });
            if (!foundMember) {
                next(BaseException_1.BaseException.notAllowed());
                return;
            }
            if (title)
                foundPost.title = title;
            if (body)
                foundPost.body = body;
            if (files)
                foundPost.files = files;
            const updatedPost = await foundPost.save();
            res.status(httpStatusCodes_1.httpStatusCode.CREATED).json({
                success: true,
                data: updatedPost,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteById(req, res, next) {
        try {
            const { postId } = req.params;
            // @ts-ignore
            const { id: userId } = req.user;
            const foundPost = await db.post.findByPk(postId);
            if (!foundPost) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Check that member of group through album
            const foundAlbum = await db.album.findByPk(foundPost.albumId);
            if (!foundAlbum) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            const foundMember = await db.groupmember.findOne({
                where: {
                    memberId: userId,
                    groupId: foundAlbum.groupId,
                },
            });
            if (!foundMember) {
                next(BaseException_1.BaseException.notAllowed());
                return;
            }
            await foundPost.destroy();
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                data: null,
                message: 'Post deleted',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async uploadPostImages(req, res, next) {
        try {
            if (!req.files) {
                next(BaseException_1.BaseException.notFileFound());
                return;
            }
            const uploadedFiles = [];
            const files = req.files;
            for (let i = 0; i < files.length; i++) {
                const optimizedImageBuffer = await ImageProcessing_1.ImageProcessing.optimize(files[i].path);
                const uploadResult = await (0, FileUploadMiddleware_1.uploadFile)(optimizedImageBuffer, files[i].originalname);
                uploadedFiles.push(uploadResult.Key);
                await (0, deleteFiles_1.unlinkFile)(files[i].path);
            }
            res.status(httpStatusCodes_1.httpStatusCode.CREATED).json({
                success: true,
                data: {
                    imageKeys: uploadedFiles,
                },
                message: 'Post files uploaded',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PostControllers = PostControllers;
