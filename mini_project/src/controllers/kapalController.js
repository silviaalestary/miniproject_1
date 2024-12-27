const KapalModel = require('../models/kapalModel');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class KapalController {
  // Fungsi helper untuk verifikasi token
  static verifyUserToken(req) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new Error('Token diperlukan');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  static async getAll(req, res) {
    try {
      // Verifikasi token
      await KapalController.verifyUserToken(req);
      
      const kapal = await KapalModel.getAll();
      res.json(kapal);
    } catch (error) {
      if (error.message === 'Token diperlukan' || error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token tidak valid atau diperlukan' });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      await KapalController.verifyUserToken(req);
      
      const kapal = await KapalModel.getById(req.params.id);
      if (!kapal) {
        return res.status(404).json({ message: 'Kapal tidak ditemukan' });
      }
      res.json(kapal);
    } catch (error) {
      if (error.message === 'Token diperlukan' || error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token tidak valid atau diperlukan' });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const decoded = await KapalController.verifyUserToken(req);
      
      // Cek role admin
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Hanya admin yang dapat membuat data' });
      }

      const { nama_kapal, jenis_kapal, kapasitas_muatan } = req.body;
      
      if (!nama_kapal || !jenis_kapal || !kapasitas_muatan) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
      }

      if (kapasitas_muatan <= 0) {
        return res.status(400).json({ message: 'Kapasitas muatan harus positif' });
      }

      const result = await KapalModel.create(req.body);
      
      // Notifikasi WebSocket
      global.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            event: 'data_changed',
            message: 'Data kapal baru ditambahkan',
            data: { id_kapal: result.insertId, ...req.body }
          }));
        }
      });

      res.status(201).json({ message: 'Kapal berhasil ditambahkan' });
    } catch (error) {
      if (error.message === 'Token diperlukan' || error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token tidak valid atau diperlukan' });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const decoded = await KapalController.verifyUserToken(req);
      
      // Cek role admin
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Hanya admin yang dapat mengubah data' });
      }

      const kapal = await KapalModel.getById(req.params.id);
      if (!kapal) {
        return res.status(404).json({ message: 'Kapal tidak ditemukan' });
      }

      await KapalModel.update(req.params.id, req.body);
      
      // Notifikasi WebSocket
      global.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            event: 'data_changed',
            message: 'Data kapal diperbarui',
            data: { id_kapal: req.params.id, ...req.body }
          }));
        }
      });

      res.json({ message: 'Kapal berhasil diperbarui' });
    } catch (error) {
      if (error.message === 'Token diperlukan' || error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token tidak valid atau diperlukan' });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const decoded = await KapalController.verifyUserToken(req);
      
      // Cek role admin
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Hanya admin yang dapat menghapus data' });
      }

      const kapal = await KapalModel.getById(req.params.id);
      if (!kapal) {
        return res.status(404).json({ message: 'Kapal tidak ditemukan' });
      }

      await KapalModel.delete(req.params.id);
      
      // Notifikasi WebSocket
      global.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            event: 'data_changed',
            message: 'Data kapal dihapus',
            data: { id_kapal: req.params.id }
          }));
        }
      });

      res.json({ message: 'Kapal berhasil dihapus' });
    } catch (error) {
      if (error.message === 'Token diperlukan' || error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token tidak valid atau diperlukan' });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = KapalController; 