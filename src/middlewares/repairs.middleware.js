const catchAsync = require('../utils/catchAsync');
const { Repairs, repairsStatus } = require('../models/repairs.model');
const AppError = require('../utils/appError');

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('You do not have permission to perfom this action.!', 403)
      );
    }

    next();
  };
};

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
