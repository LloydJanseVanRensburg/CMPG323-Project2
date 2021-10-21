import express from 'express';
import { GroupControllers } from '../controllers/GroupControllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { upload } from '../middleware/FileUploadMiddleware';

const router = express.Router();

// @route /api/v1/groups
// @desc - GET get all groups
// @access Private
router.get('/', AuthMiddleware.auth, GroupControllers.getAll);

// @route /api/v1/groups
// @desc - POST create new group
// @access Private
router.post(
  '/',
  AuthMiddleware.auth,
  upload.single('image'),
  GroupControllers.create
);

// @route /api/v1/groups/:groupId
// @desc - GET get group by id
// @access Private
router.get('/:groupId', AuthMiddleware.auth, GroupControllers.getById);

// @route /api/v1/groups/:groupId
// @desc - PUT update group by id
// @access Private
router.put(
  '/:groupId',
  AuthMiddleware.auth,
  upload.single('image'),
  GroupControllers.updateById
);

// @route /api/v1/groups/:groupId
// @desc - DELETE remove group by id
// @access Private
router.delete('/:groupId', AuthMiddleware.auth, GroupControllers.deleteById);

export default router;
