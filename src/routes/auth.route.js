const express = require('express');

//controllers
const authController = require('./../controllers/auth.controller');

//middlewares
const validationMiddleware = require('./../middlewares/validations.middleware');

const router = express.Router();

router.post(
  '/logup',
  validationMiddleware.createUserValidation,
  authController.logUp
);

router.post(
  '/login',
  validationMiddleware.loginUserValidation,
  authController.logIn
);

module.exports = router;
