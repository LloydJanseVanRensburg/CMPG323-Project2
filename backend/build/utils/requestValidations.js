"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayLength = exports.isArray = exports.objectLength = exports.isDefined = exports.isString = exports.validateUpdatePostBody = exports.validateCreatePostBody = exports.validateCreateAlbumBody = exports.validateUpdateAlbumBody = exports.validateGetAlbumPostsBody = exports.validateGetGroupAlbumBody = exports.validateCreateGroupBody = exports.validateRegisterAuthBody = exports.validateLoginAuthBody = void 0;
const validateLoginAuthBody = (body) => {
    return ((0, exports.isDefined)(body) &&
        (0, exports.objectLength)(body) > 0 &&
        (0, exports.isDefined)(body.email) &&
        (0, exports.isString)(body.email) &&
        (0, exports.isDefined)(body.password) &&
        (0, exports.isString)(body.password));
};
exports.validateLoginAuthBody = validateLoginAuthBody;
const validateRegisterAuthBody = (body) => {
    return ((0, exports.isDefined)(body) &&
        (0, exports.objectLength)(body) > 0 &&
        (0, exports.isDefined)(body.username) &&
        (0, exports.isString)(body.username) &&
        (0, exports.isDefined)(body.email) &&
        (0, exports.isString)(body.email) &&
        (0, exports.isDefined)(body.password) &&
        (0, exports.isString)(body.password));
};
exports.validateRegisterAuthBody = validateRegisterAuthBody;
const validateCreateGroupBody = (body) => {
    return ((0, exports.isDefined)(body) &&
        (0, exports.objectLength)(body) > 0 &&
        (0, exports.isDefined)(body.title) &&
        (0, exports.isString)(body.title) &&
        (0, exports.isDefined)(body.description) &&
        (0, exports.isString)(body.description));
};
exports.validateCreateGroupBody = validateCreateGroupBody;
const validateGetGroupAlbumBody = (body) => {
    return ((0, exports.isDefined)(body) &&
        (0, exports.objectLength)(body) > 0 &&
        (0, exports.isDefined)(body.groupId) &&
        (0, exports.isString)(body.groupId));
};
exports.validateGetGroupAlbumBody = validateGetGroupAlbumBody;
const validateGetAlbumPostsBody = (body) => {
    return ((0, exports.isDefined)(body) &&
        (0, exports.objectLength)(body) > 0 &&
        (0, exports.isDefined)(body.albumId) &&
        (0, exports.isString)(body.albumId));
};
exports.validateGetAlbumPostsBody = validateGetAlbumPostsBody;
const validateUpdateAlbumBody = (body) => {
    return (((0, exports.isDefined)(body) &&
        (0, exports.objectLength)(body) > 0 &&
        (0, exports.isDefined)(body.title) &&
        (0, exports.isString)(body.title)) ||
        ((0, exports.isDefined)(body.description) && (0, exports.isString)(body.description)));
};
exports.validateUpdateAlbumBody = validateUpdateAlbumBody;
const validateCreateAlbumBody = (body) => {
    return ((0, exports.isDefined)(body) &&
        (0, exports.objectLength)(body) > 0 &&
        (0, exports.isDefined)(body.groupId) &&
        (0, exports.isString)(body.groupId) &&
        (0, exports.isDefined)(body.title) &&
        (0, exports.isString)(body.title) &&
        (0, exports.isDefined)(body.color) &&
        (0, exports.isString)(body.color) &&
        (0, exports.isDefined)(body.description) &&
        (0, exports.isString)(body.description));
};
exports.validateCreateAlbumBody = validateCreateAlbumBody;
const validateCreatePostBody = (body) => {
    return ((0, exports.isDefined)(body) &&
        (0, exports.objectLength)(body) > 0 &&
        (0, exports.isDefined)(body.albumId) &&
        (0, exports.isString)(body.albumId) &&
        (0, exports.isDefined)(body.title) &&
        (0, exports.isString)(body.title) &&
        (0, exports.isDefined)(body.files) &&
        (0, exports.isArray)(body.files) &&
        (0, exports.arrayLength)(body.files) > 0 &&
        (0, exports.isDefined)(body.body) &&
        (0, exports.isString)(body.body));
};
exports.validateCreatePostBody = validateCreatePostBody;
const validateUpdatePostBody = (body) => {
    return (((0, exports.isDefined)(body) && (0, exports.objectLength)(body) > 0) ||
        ((0, exports.isDefined)(body.title) && (0, exports.isString)(body.title)) ||
        ((0, exports.isDefined)(body.files) &&
            (0, exports.isArray)(body.files) &&
            (0, exports.arrayLength)(body.files) > 0) ||
        ((0, exports.isDefined)(body.body) && (0, exports.isString)(body.body)));
};
exports.validateUpdatePostBody = validateUpdatePostBody;
const isString = (string) => {
    return typeof string === 'string' || string instanceof String;
};
exports.isString = isString;
const isDefined = (param) => {
    if (param) {
        return true;
    }
    return false;
};
exports.isDefined = isDefined;
const objectLength = (data) => {
    let length = 0;
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            length++;
        }
    }
    return length;
};
exports.objectLength = objectLength;
const isArray = (data) => {
    return Array.isArray(data);
};
exports.isArray = isArray;
const arrayLength = (data) => {
    return data.length;
};
exports.arrayLength = arrayLength;
