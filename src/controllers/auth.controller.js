const catchAsync = require('../utils/catchAsync');
const User = require('./../models/user.model');
const bcrypt = require('bcryptjs');
const generateJWT = require('./../utils/jwt');
const AppError = require('../utils/appError');

exports.logUp = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    message: 'The user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  //1. traernos la informacion de la req.body
  const { email, password } = req.body;

  //2. buscar el usuario y revisar si existe
  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: 'available',
    },
  });

  if (!user) {
    return next(new AppError(`User with email: ${email} not found`, 404));
  }
  //3. validar si la contraseña es correcta
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //4. generar el token
  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. traerme el usuario que viene de la req, del midleware
  const { user } = req;

  //2. traerme los datos de la req.body
  const { currentPassword, newPassword } = req.body;

  //3. validar si la contraseña actual y nueva son iguales enviar un error
  if (currentPassword === newPassword) {
    return next(new AppError('The password cannot be equals', 400));
  }

  //4. validar si la contraseña actual es igual a la contraseña en bd
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  //5. encriptar la nueva contraseña
  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);

  //6. actualizar el usuario que viene de la req
  await user.update({
    password: encryptedPassword,
    passwordChangedAt: new Date(),
  });

  //7. enviar el mensaje al cliente
  return res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfully',
  });
});
