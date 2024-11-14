// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vida: { type: Number, default: 100 },
    energia: { type: Number, default: 100 },
    dinero: { type: Number, default: 0 },
    monedaPremium: { type: Number, default: 0 },
    Character: {
        Armamento: { type: Array, default: [] },
        Equipamiento: { type: Array, default: [] },
        Vehículo: { type: Array, default: [] }
    },
    Inventory: { type: Array, default: [] }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
