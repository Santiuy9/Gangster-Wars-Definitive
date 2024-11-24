const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Modelo de usuario

const router = express.Router();

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Se espera 'Bearer <token>'
  if (!token) return res.status(401).json({ message: 'Acceso denegado. No se encontró token.' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    req.user = user;
    next();
  });
};

// Ruta para iniciar una misión
router.put('/user/:userId/start-mission', authenticateToken, async (req, res) => {
    const { userId, missionId, duration } = req.body;

    // Validación de entrada
    if (!userId || !missionId || typeof duration !== 'number') {
        return res.status(400).json({ error: 'Datos de entrada inválidos.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Verificar si el usuario tiene suficiente energía
        const mission = missionsData.find(m => m.id === missionId);
        if (!mission) return res.status(404).json({ error: 'Misión no encontrada' });

        if (user.energia < mission.costEnergy) {
            return res.status(400).json({ error: 'No tienes suficiente energía para iniciar la misión.' });
        }

        // Restar la energía
        user.energia -= mission.costEnergy;

        // Calcular el tiempo de fin de la misión
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + duration * 1000); // duración en segundos

        // Actualizar misión activa
        user.missionStatus = {
            isActive: true,
            missionId,
            startTime,
            duration,
            endTime
        };

        // Guardar los cambios en el usuario
        await user.save();

        // Responder con los nuevos datos del usuario y la misión
        res.json({
            message: 'Misión iniciada',
            missionStatus: user.missionStatus,
            updatedUserInfo: {
                energia: user.energia,
                experiencia: user.experiencia,
                dinero: user.dinero
            }
        });
    } catch (error) {
        console.error('Error al iniciar la misión:', error);
        res.status(500).json({ error: 'Error al iniciar la misión' });
    }
});



  
  
  

// Ruta para consultar la misión activa
router.get('/user/:userId/current-mission', authenticateToken, async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  
      const { missionStatus } = user;
  
      // Si no hay misión activa
      if (!missionStatus.isActive) {
        return res.json({ currentMission: null });
      }
  
      const now = new Date();
      const elapsedTime = Math.floor((now - new Date(missionStatus.startTime)) / 1000);
      const timeRemaining = missionStatus.duration - elapsedTime;
  
      if (timeRemaining <= 0) {
        // Si ya terminó, borrar la misión activa
        user.missionStatus = {
          isActive: false,
          missionId: null,
          startTime: null,
          duration: null,
          endTime: null,
        };
        await user.save();
        return res.json({ currentMission: null });
      }
  
      res.json({
        missionId: missionStatus.missionId,
        timeRemaining,
      });
    } catch (error) {
      console.error('Error obteniendo misión activa:', error);
      res.status(500).json({ error: 'Error obteniendo la misión activa' });
    }
});

// Ruta para completar la misión
router.put('/user/:userId/complete-mission', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    const { missionId } = req.body;
    console.log("Datos recibidos para completar la misión:", { userId, missionId });
  
    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
  
    // Verificar que la misión está en progreso
    const activeMission = user.missionStatus;
    if (!activeMission || activeMission.missionId !== missionId || activeMission.isActive !== true) {
        return res.status(400).json({
            error: 'La misión no está activa o no corresponde.',
            reason: !activeMission
                ? "No hay misión activa en el usuario."
                : activeMission.missionId !== missionId
                ? "El ID de misión no coincide."
                : "La misión ya está completada.",
        });
    }
        
  
    // Actualizar el estado de la misión a completada
    user.missionStatus.isActive = false;
    user.missionStatus.endTime = new Date(); // Opcional: podemos agregar la fecha de finalización
  
    // Aquí puedes agregar lógica para dar recompensas como dinero, XP, etc.
    // user.energia += 10; // Ejemplo de aumento de energía
    // user.experience += 50; // Ejemplo de XP
  
    try {
      // Guardar los cambios
      await user.save();
      res.json({ message: 'Misión completada exitosamente', missionStatus: user.missionStatus });
    } catch (error) {
      console.error('Error al completar la misión:', error);
      res.status(500).json({ error: 'Error al completar la misión' });
    }
});
  

module.exports = router;