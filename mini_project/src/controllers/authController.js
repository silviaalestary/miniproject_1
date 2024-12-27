const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthController {
  static async register(req, res) {
    try {
      const { username, password, role } = req.body;
      
      // Validasi input
      if (!username || !password || !role) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
      }

      // Cek username yang sudah ada
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username sudah digunakan' });
      }

      await UserModel.register(username, password, role);
      res.status(201).json({ message: 'Registrasi berhasil' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      const user = await UserModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Username atau password salah' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Username atau password salah' });
      }

      const token = jwt.sign(
        { id: user.id_user, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AuthController; 