const joi = require('joi');

module.exports = {
  createUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
      password: joi.string().min(6).max(32).required().label('Password'),
      _passwordconfirm: joi.string().min(6).max(32).required().label('_Passwordconfirm'),
    },
  },

  updateUser: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changePassword: {
    body: {
      oldPassword: joi.string().required().label('oldPassword'),
      newPassword: joi.string().min(6).max(32).required().label('newPassword'),
      confirmNewPassword: joi.string().min(6).max(32).required().label('confirmNewPassword'),
    },
  },
};
