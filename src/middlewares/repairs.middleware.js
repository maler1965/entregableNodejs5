const catchAsync = require('../utils/catchAsync');
const { Repairs, repairsStatus } = require('../models/repairs.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');

exports.validEmployeeUser = catchAsync(async (req, res, next) => {
  const user = req.sessionUser;
  const id = user.id;

  const userEmployee = await User.findOne({
    where: {
      status: 'available',
      role: 'employee',
      id,
    },
  });

  if (!userEmployee) {
    return next(new AppError(`User with id: ${id} not is employee`, 404));
  }

  req.userEmployee = userEmployee;
  next();
});

exports.validRepairsId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repairs = await Repairs.findOne({
    where: {
      status: repairsStatus.pending,
      id,
    },
  });

  if (!repairs) {
    return next(new AppError(`Repairs with id: ${id} not found`, 404));
  }

  req.repairs = repairs;
  next();
});

exports.validRepairsCompleted = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repairs = await Repairs.findOne({
    where: {
      status: repairsStatus.completed,
      id,
    },
  });

  if (!repairs) {
    return next(new AppError(`Repairs with id: ${id} is not completed`, 404));
  }

  req.repairs = repairs;
  next();
});
