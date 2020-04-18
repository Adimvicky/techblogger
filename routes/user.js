const express = require('express');
const userController = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/index');
const router = express.Router();


router.post('/signup',userController.createAccount);
router.post('/signin',userController.login);
router.put('/update',isLoggedIn,userController.updateUser);
// router.get('/data',isLoggedIn,userController.getUserData);

module.exports = router;