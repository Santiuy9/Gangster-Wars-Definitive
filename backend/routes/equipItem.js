const express = require('express');
const router = express.Router();
const equipItemController = require('../controllers/equipItemController');

// Ruta para equipar un ítem
router.post('/', equipItemController.equipItem);

module.exports = router;
