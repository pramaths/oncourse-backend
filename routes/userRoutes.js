const express = require('express');
const router = express.Router();
const userController = require('../controllers/doctorController');

router.post('/users', userController.createUser);


router.get('/users/:email', userController.getUser);

module.exports = router;
