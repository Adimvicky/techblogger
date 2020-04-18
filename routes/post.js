const express = require('express');
const postController = require('../controllers/postController');
const { isLoggedIn } = require('../middleware/index');
const router = express.Router();


router.post('/new',isLoggedIn,postController.newPost);
router.get('/',isLoggedIn,postController.getPosts);
router.delete('/:postId',isLoggedIn,postController.deletePost);
router.put('/:postId',isLoggedIn,postController.updatePost);


module.exports = router;