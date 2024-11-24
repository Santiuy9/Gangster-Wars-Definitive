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

// Middleware pre-save para modificar los datos antes de guardarlos
itemSchema.pre('save', function(next) {
    // Si la categoría es "Armamento", eliminamos los campos no relevantes
    if (this.category === 'Armamento') {
        this.defense = undefined; // No guardamos la defensa
        this.speed = undefined;   // No guardamos la velocidad
    }
    // Si la categoría es "Equipamiento", eliminamos los campos no relevantes
    else if (this.category === 'Equipamiento') {
        this.damage = undefined;  // No guardamos el daño
        this.speed = undefined;   // No guardamos la velocidad
    }
    // Si la categoría es "Vehículo", eliminamos los campos no relevantes
    else if (this.category === 'Vehículo') {
        this.damage = undefined;  // No guardamos el daño
        this.defense = undefined; // No guardamos la defensa
    }
    
    next(); // Continuamos con el guardado
});

// Esquema principal del usuario
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vida: { type: Number, default: 100 },
    energia: { type: Number, default: 100 },
    dinero: { type: Number, default: 10000 },
    monedaPremium: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    stats: {  // Subobjeto para las estadísticas
      ataque: { type: Number, default: 0 },
      defensa: { type: Number, default: 0 },
      velocidad: { type: Number, default: 0 },
    },
    character: {
      Armamento: { type: itemSchema, default: null },
      Equipamiento: { type: itemSchema, default: null },
      Vehículo: { type: itemSchema, default: null },
    },
    inventory: [itemSchema],
    missionStatus: {  // Estado de la misión
      isActive: { type: Boolean, default: false },
      missionId: { type: String, default: null },
      startTime: { type: Date, default: null }, // Hora de inicio
      duration: { type: Number, default: null }, // Duración en segundos
      endTime: { type: Date, default: null },   // Hora de finalización (opcional)
    },
  }, { timestamps: true });

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