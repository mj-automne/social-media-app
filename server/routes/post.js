const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');


/* 글 목록 */
router.get('/', async(req, res, next) => {
  try {
    const where = {}
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC']
      ],
      include: [{
        model: User,
        attributes: ['id', 'name']
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'name']
        }]
      }]
    });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});


/* 글 등록 */
router.post('/', async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: User,
        attributes: ['id', 'name']
      },{
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'name']
        }]
      }]
    });
    res.status(201).json(fullPost);
  } catch (err) {
    console.error(err);
    next(err);
  }
});


/* 댓글 등록 */
router.post('/:postId/comment', async (req, res, next) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'name']
      }]
    });
    res.status(201).json(fullComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;