const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const registerRouter = require('./routes/register'); // Importa las rutas de registro
const loginRoute = require('./routes/login');
const jwt = require('jsonwebtoken');

require('dotenv').config(); // Carga las variables desde .env

const app = express();
const PORT = 5000; // O el puerto que prefieras

// Configuración de CORS con origen específico
const corsOptions = {
    origin: 'http://localhost:5173', // Origen de tu frontend
    credentials: true // Permitir envío de cookies o encabezados de autorización
};
app.use(cors(corsOptions)); // Configura CORS con las opciones específicas

app.use(express.json()); // Para procesar JSON

// Ruta de prueba para verificar si el servidor funciona
app.get('/', (req, res) => {
    res.send('¡Servidor Express funcionando!');
});

// Ruta para verificar autenticación
app.get('/api/auth/check', (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del header Authorization
  
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // Usa el secreto desde .env
            if (err) {
                return res.json({ isAuthenticated: false });
            }
            res.json({ isAuthenticated: true, user: decoded });
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/Gangster-Wars-DB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Usar las rutas de registro y login
app.use('/api', registerRouter);
app.use('/api/login', loginRoute);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
