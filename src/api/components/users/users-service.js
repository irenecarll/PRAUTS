const usersRepository = require('./users-repository');
const { hashPassword } = require('../../../utils/password');

const bcrypt = require('bcrypt'); // import modul bycrypt untuk compare kesamaan password
/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @param {string} _passwordconfirm - Passwordconfirm
 * @returns {boolean}
 */
async function createUser(name, email, password, _passwordconfirm) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */

async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check email jika sudah ada
 * @param {string} email - email
 * @returns {boolean}
 */

async function checkEmailExist(email) {
  try {
    const userExist = await usersRepository.checkUserByEmail(email);
    return userExist;
  } catch (error) {
    console.error("Error", error);
    return false;
  }
}

/**
 * Hash password supaya tidak mudah dihack
 * @param {string} password - password
 * @returns {string} - hash password
 */

async function hashUserPassword(password) {
  try {
    const hashedPassword = await hashPassword(password);
    return hashedPassword;
  } catch (error) {
  console.error("Hashing error", error);
  throw new Error("Password Hashing Error");
  }
}

/**
 * Change password
 * @param {string} id - User ID
 * @param {string} oldPassword - Old password
 * @param {string} newPassword - New password
 * @returns {boolean} - menghasilkan nilai boolean jika suatu proses berhasil atau gagal
 */

async function changePassword(id, oldPassword, newPassword) {
  // melihat data user
  const user = await usersRepository.getUser(id);

  // cek apakah data user ada di database
  if (!user) {
    return null; // jika data user tidak ada maka akan mengembalikan nilai null
  }

  // mencocokkan password lama dengan input password lama yang dimasukkan pengguna saat ini
  const passwordMatch = await bcrypt.compare (oldPassword, user.password);
  if (!passwordMatch) {
    return false; // jika tidak matching maka akan mengembalikan nilai false
  }

  // melakukan hashing untuk password baru supaya tidak mudah di hack
  const hashedNewPassword = await hashPassword(newPassword);

  // update password
  try {
    await usersRepository.updatePassword(id, hashedNewPassword); // menanggil fungsi update password dari usersRepository
    return true; // mengembalikan nilai true jika berhasil update password
  } catch (error) {
    console.error("Error while updating password:", error);
    return null; // menampilkan output error jika tidak berhasil update password
  }
}




module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkEmailExist,
  hashUserPassword,
  changePassword,
};
