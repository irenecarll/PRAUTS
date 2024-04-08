const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

const bcrypt = require('bcrypt'); // import modul bcrypt
/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const _passwordconfirm =  request.body._passwordconfirm;

    //check apakah password yg diinput matching
    if (password !== _passwordconfirm) {
      throw errorResponder(errorTypes.INVALID_PASSWORD, 
      'Password not matching'
    );
    }

    //check apakah email sudah ada sebelumnya dengan memanggil function dari service
    const emailExist = await usersService.checkEmailExist(email);
    if (emailExist) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email Already Taken'
      );
    }

    // Hashing password supaya tidak mudah dihack
    const hashedPassword = await usersService.hashUserPassword(password);
    
    
    // Jika email belum pernah ada, maka panggil fungsi create user
    const success = await usersService.createUser(name, email, hashedPassword);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Unprocessable entity'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}
/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * update password
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function updatePassword(request, response, next) {
  try {
    const id = request.params.id;
    const oldPassword = request.body.oldPassword;
    const newPassword = request.body.newPassword;
    const confirmNewPassword = request.body.confirmNewPassword;

    // melakukan pengecekan apakah konfirmasi password baru sama dengan password baru yang diinput
    if (newPassword !== confirmNewPassword) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD, // jika tidak cocok maka akan menampilkan invalid password
        'Password confirm do not match'
      );
    }

    // memanggil fungsi changePassword dari users-service.js
    const success = await usersService.changePassword(id, oldPassword, newPassword);
    if (!success) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD, // jika gagal maka akan menampilkan pesan error UNAUTHORIZED
        'Change password failed, make sure your old password is correct'
      );
    }

    return response.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    return next(error);
  }
}


module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
};
