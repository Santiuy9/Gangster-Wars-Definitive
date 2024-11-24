const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/User'); // Modelo de usuario
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const missionRoutes = require('./routes/missions')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => {
    console.error('Error al conectar a MongoDB', err);
    process.exit(1); // Finaliza el proceso si falla la conexión
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', missionRoutes)

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});







// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const User = require('./models/User'); // Modelo de usuario
// const registerRoute = require('./routes/register'); // Rutas de registro
// const loginRoute = require('./routes/login'); // Ruta de login
// const authRoutes = require('./routes/auth');
// const equipItemRoute = require('./routes/equipItem');
// const playerRoutes = require('./routes/player');
// require('dotenv').config(); // Variables de entorno

// const app = express();
// const PORT = 5000;

// // Configuración de CORS con origen específico
// const corsOptions = {
//     origin: 'http://localhost:5173',
//     credentials: true
// };
// app.use(cors(corsOptions));
// app.use(express.json()); // Para procesar JSON

// // Ruta de prueba
// app.get('/', (req, res) => {
//     res.send('¡Servidor Express funcionando!');
// });

// // Middleware de autenticación
// const authMiddleware = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//         return res.status(401).json({ message: "Token no proporcionado" });
//     }

//     console.log("Token recibido:", token);  // Log para verificar el token recibido

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             console.log("Error al verificar el token:", err);  // Log para depurar errores
//             return res.status(401).json({ message: "Token no válido" });
//         }

//         console.log("Token decodificado:", decoded);  // Log para verificar que el token está bien decodificado

//         req.userId = decoded.userId;
//         next();
//     });
// };


// // Ruta para obtener los datos del usuario autenticado
// app.get('/api/users/me', authMiddleware, async (req, res) => {
//     try {
//         const user = await User.findById(req.userId);
//         if (!user) {
//             return res.status(404).json({ message: "Usuario no encontrado" });
//         }
//         res.json(user);
//     } catch (error) {
//         console.error("Error al obtener usuario:", error);
//         res.status(500).json({ message: "Error en el servidor", error: error.message });
//     }
// });

// // Ruta para verificar autenticación
// app.get('/api/auth/check', (req, res) => {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (token) {
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 return res.json({ isAuthenticated: false });
//             }
//             res.json({ isAuthenticated: true, user: decoded });
//         });
//     } else {
//         res.json({ isAuthenticated: false });
//     }
// });

// // Ruta para obtener un usuario por su ID
// app.get('/api/users/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'Usuario no encontrado' });
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: 'Error en el servidor', error: error.message });
//     }
// });

// // Función para equipar un ítem en el personaje
// async function equipItem(req, res) {
//     const { userId, itemId, category } = req.body; // Suponemos que el itemId es el identificador del ítem que el jugador quiere equipar

//     try {
//         // Buscar al usuario por su ID
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Buscar el ítem en el inventario
//         const item = user.inventory.find(i => i._id.toString() === itemId);

//         if (!item) {
//             return res.status(404).json({ message: 'Item not found in inventory' });
//         }

//         // Verificar que el ítem corresponde a la categoría especificada
//         if (item.category !== category) {
//             return res.status(400).json({ message: `Item is not of the correct category: ${category}` });
//         }

//         // Equipar el ítem en la categoría correspondiente del personaje
//         user.character[category.toLowerCase()] = item;

//         // Guardar los cambios
//         await user.save();

//         return res.status(200).json({ message: 'Item equipped successfully', user });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Error equipping item' });
//     }
// }

// // Ruta para actualizar datos de usuario
// app.put('/api/users/:id', authMiddleware, async (req, res) => {
//     const { id } = req.params;
//     const { dinero, newItem } = req.body;
//     console.log("Nuevo ítem recibido en el backend:", newItem); // Confirmación

//     try {
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ message: "Usuario no encontrado" });
//         }

//         user.dinero = dinero;
//         user.inventory.push(newItem);

//         await user.save();
//         res.json({ message: "Datos del usuario actualizados correctamente" });
//     } catch (error) {
//         console.error("Error al actualizar usuario:", error);
//         res.status(500).json({ message: "Error al actualizar usuario" });
//     }
// });

// const authenticateJWT = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1];
//     if (!token) return res.status(401).send('Acceso denegado');

//     jwt.verify(token, 'secret_key', (err, user) => {
//         if (err) return res.status(403).send('Token no válido');
//         req.user = user;
//         next();
//     });
// };

// app.get('/api/user', authenticateJWT, async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).send('Usuario no encontrado');
//         res.json(user);
//     } catch (err) {
//         res.status(500).send('Error al obtener los datos del usuario');
//     }
// });

// // Conectar a MongoDB
// mongoose.connect('mongodb://localhost:27017/Gangster-Wars-DB', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Conectado a MongoDB'))
//     .catch(err => console.error('Error al conectar a MongoDB:', err));

// // Usar las rutas de registro y login
// app.use('/api', registerRoute);
// app.use('/api/login', loginRoute);
// app.use('/api/auth', authRoutes)
// app.use('/api/players', playerRoutes);
// app.use('/api/equip-item', equipItemRoute);

// // Iniciar el servidor
// app.listen(PORT, () => {
//     console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });
