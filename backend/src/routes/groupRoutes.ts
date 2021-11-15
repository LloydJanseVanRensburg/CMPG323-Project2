import express from 'express';
import { GroupControllers } from '../controllers/GroupControllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { upload } from '../middleware/FileUploadMiddleware';

const router = express.Router();

// @route   -   /api/v1/groups
// @desc    -   GET fetch all groups
// @access  -   Private
router.get('/', AuthMiddleware.auth, GroupControllers.getAll);

// @route   -   /api/v1/groups
// @desc    -   POST create new group
// @access  -   Private
router.post(
  '/',
  AuthMiddleware.auth,
  upload.single('image'),
  GroupControllers.create
);

// @route   -   /api/v1/groups/:groupId
// @desc    -   GET fetch group by id
// @access  -   Private
router.get('/:groupId', AuthMiddleware.auth, GroupControllers.getById);

// @route   -   /api/v1/groups/:groupId
// @desc    -   PUT update group by id
// @access  -   Private
router.put(
  '/:groupId',
  AuthMiddleware.auth,
  upload.single('image'),
  GroupControllers.updateById
);

// @route   -   /api/v1/groups/:groupId
// @desc    -   DELETE remove group by id
// @access  -   Private
router.delete('/:groupId', AuthMiddleware.auth, GroupControllers.deleteById);

// @route   -   /api/v1/groups/:groupId/invite
// @desc    -   POST send invite to group of emails
// @access  -   Private
router.post(
  '/:groupId/invite',
  AuthMiddleware.auth,
  GroupControllers.inviteToGroup
);

// @route   -   /api/v1/groups/:groupId/join
// @desc    -   POST join group from
// @access  -   Public
router.post('/:groupId/join', GroupControllers.joinGroup);

// @route   -   /api/v1/groups/:groupId/leave
// @desc    -   DELETE remove user from group
// @access  -   Private
router.delete(
  '/:groupId/leave',
  AuthMiddleware.auth,
  GroupControllers.leaveGroup
);

export default router;
