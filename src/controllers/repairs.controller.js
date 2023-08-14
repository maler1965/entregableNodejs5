const catchAsync = require('../utils/catchAsync');
const { Op } = require('sequelize');

const { Repairs, repairsStatus } = require('../models/repairs.model');
const User = require('../models/user.model');

exports.findAllRepairs = catchAsync(async (req, res, next) => {
  const repairs = await Repairs.findAll({
    where: {
      status: {
        [Op.in]: [repairsStatus.pending, repairsStatus.completed], //para escoger los que estan pendientes y los completos a la vez
      },
    },
    attributes: {
      exclude: ['userId'], //se quito de aqui el status, para que status sea incluido en la respuesta y pueda saber cual es pendiente y cual es completo
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ['password'], //Se redujo lo que se excluye para que envie todo, menos la contrasena
        },
      },
    ],
    order: [['createdAt', 'DESC']], //para que muestre la informacion de madera descendente, por orden de creacion
    limit: 10, //limita a los ultimos 10
  });

  return res.status(200).json({
    status: 'success',
    results: repairs.length,
    repairs,
  });
});

exports.createRepairs = catchAsync(async (req, res, next) => {
  const { date, motorsNumber, description } = req.body;
  const user = req.sessionUser;
  const userId = user.id;

  const repairs = await Repairs.create({
    date,
    motorsNumber,
    description,
    userId,
  });

  return res.status(201).json({
    status: 'success',
    message: 'the repairs has been created!',
    repairs,
  });
});

exports.findOneRepairs = catchAsync(async (req, res, next) => {
  const { repairs } = req;

  return res.status(200).json({
    status: 'sucess',
    repairs,
  });
});

exports.updateRepairs = catchAsync(async (req, res, next) => {
  const { repairs } = req;

  const status = repairsStatus.completed;

  await repairs.update({ status });

  return res.status(200).json({
    status: 'success',
    message: 'the repairs has been updated',
  });
});

exports.deleteRepairs = catchAsync(async (req, res, next) => {
  const { repairs } = req;

  await repairs.update({ status: repairsStatus.cancelled });

  return res.status(200).json({
    status: 'success',
    message: 'the repairs has been deleted!',
  });
});
