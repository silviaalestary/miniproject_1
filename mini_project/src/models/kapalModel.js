const db = require('../config/database');

class KapalModel {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM kapal');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM kapal WHERE id_kapal = ?',
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const { nama_kapal, jenis_kapal, kapasitas_muatan } = data;
    const [result] = await db.execute(
      'INSERT INTO kapal (nama_kapal, jenis_kapal, kapasitas_muatan) VALUES (?, ?, ?)',
      [nama_kapal, jenis_kapal, kapasitas_muatan]
    );
    return result;
  }

  static async update(id, data) {
    const { nama_kapal, jenis_kapal, kapasitas_muatan } = data;
    const [result] = await db.execute(
      'UPDATE kapal SET nama_kapal = ?, jenis_kapal = ?, kapasitas_muatan = ? WHERE id_kapal = ?',
      [nama_kapal, jenis_kapal, kapasitas_muatan, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM kapal WHERE id_kapal = ?',
      [id]
    );
    return result;
  }
}

module.exports = KapalModel; 