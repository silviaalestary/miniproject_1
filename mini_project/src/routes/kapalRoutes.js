const express = require('express');
const router = express.Router();
const KapalController = require('../controllers/kapalController');

router.get('/', KapalController.getAll);
router.get('/:id', KapalController.getById);
router.post('/', KapalController.create);
router.put('/:id', KapalController.update);
router.delete('/:id', KapalController.delete);

module.exports = router; 