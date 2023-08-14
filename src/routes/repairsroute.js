const express = require('express');

//controllers
const repairsController = require('../controllers/repairs.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');
const repairsMiddleware = require('../middlewares/repairs.middleware');

const router = express.Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    validationMiddleware.createRepairsValidation,
    repairsController.createRepairs
  );

router.use(authMiddleware.protect); //para saber que se loggio

router.use(repairsMiddleware.validEmployeeUser);

router.route('/').get(repairsController.findAllRepairs);

router
  .route('/:id')
  .get(repairsMiddleware.validRepairsId, repairsController.findOneRepairs)
  .patch(repairsMiddleware.validRepairsId, repairsController.updateRepairs);

router
  .route('/:id')
  .delete(
    repairsMiddleware.validRepairsCompleted,
    repairsController.deleteRepairs
  );

module.exports = router;
