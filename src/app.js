const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHander = require('./controllers/error.controller');

//routes
const userRoutes = require('./routes/user.route');
const authRoutes = require('./routes/auth.route');
const repairsRoutes = require('./routes/repairsroute');

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/repairs', repairsRoutes);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHander);

module.exports = app;
