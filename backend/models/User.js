// models/User.js
const mongoose = require('mongoose');

// Esquema para los ítems (Armamento, Equipamiento, Vehículo)
const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    damage: { type: Number, default: 0 }, // Para armamento
    defense: { type: Number, default: 0 }, // Para equipamiento
    speed: { type: Number, default: 0 }, // Para vehículos
    durability: { type: Number, default: 100 },
    category: { type: String, enum: ['Armamento', 'Equipamiento', 'Vehículo'], required: true },
    price: { type: Number, default: 0 }, // Precio del objeto
    imageSrc: { type: String } // Ruta de imagen del objeto
});

// Esquema principal del usuario
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vida: { type: Number, default: 100 },
    energia: { type: Number, default: 100 },
    dinero: { type: Number, default: 0 },
    monedaPremium: { type: Number, default: 0 },
    character: {
        armamento: { type: itemSchema, default: null }, // Un solo ítem de armamento
        equipamiento: { type: itemSchema, default: null }, // Un solo ítem de equipamiento
        vehiculo: { type: itemSchema, default: null }, // Un solo ítem de vehículo
    },
    inventory: [itemSchema], // Inventario que es un array de ítems
}, { timestamps: true }); // Usamos timestamps para que guarde las fechas de creación y actualización del documento

// Creamos el modelo de User
const User = mongoose.model('User', userSchema);
module.exports = User;


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     vida: { type: Number, default: 100 },
//     energia: { type: Number, default: 100 },
//     dinero: { type: Number, default: 0 },
//     monedaPremium: { type: Number, default: 0 },
//     Character: {
//         Armamento: { type: Array, default: [] },
//         Equipamiento: { type: Array, default: [] },
//         Vehículo: { type: Array, default: [] }
//     },
//     Inventory: { type: Array, default: [] }
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;