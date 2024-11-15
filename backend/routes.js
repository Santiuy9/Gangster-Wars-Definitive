// routes/player.js
const express = require('express');
const router = express.Router();
const Player = require('../models/player'); // Suponiendo que tienes un modelo Player para MongoDB

// Obtener los datos del jugador
router.get('/:userId', async (req, res) => {
    try {
        const player = await Player.findOne({ userId: req.params.userId });
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar los datos del jugador
router.put('/:userId', async (req, res) => {
    try {
        const player = await Player.findOneAndUpdate(
            { userId: req.params.userId },
            req.body,
            { new: true }
        );
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
