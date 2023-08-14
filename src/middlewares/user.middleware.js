const AppError = require('../utils/appError');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

exports.validUser = catchAsync(async (req, res, next) => {
  //1. traer el id de la req.params, este es el id introducido por el usuario
  const { id } = req.params;
  const idUser = parseInt(id, 10);

  const userSession = req.sessionUser;
  const idSessionUser = userSession.id; //id que viene del token

  if (idUser !== idSessionUser) {
    //verifica que el id introducido sea del dueno de la cuenta
    return next(
      new AppError(
        `This id: ${id} does not belong to the owner of the account`,
        404
      )
    );
  }

  //2. buscar el usuario con status active y el id recibido
  const user = await User.findOne({
    where: {
      id: idSessionUser,
      status: 'available',
    },
  });

  //3. valido que si no existe envio el error
  if (!user) {
    return next(new AppError(`User with id: ${id} not found`, 404));
  }
  //4. adjunto el usuario por la req, y le doy paso para que avance con el next
  req.user = user;
  next();
});
