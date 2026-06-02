const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Función que crea el token JWT.
// Guarda dentro del token algunos datos básicos del usuario.
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

// Middleware para proteger rutas.
// Revisa si viene un token en el header Authorization: Bearer <token>
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Si no viene token, devolvemos error 401.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  // Extraemos solo el token sin el texto "Bearer ".
  const token = authHeader.split(' ')[1];

  try {
    // Verificamos que el token sea válido.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos la info decodificada en req.user para usarla después.
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Ruta POST /api/auth/login
// Recibe username y password, valida usuario y responde con token.
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación básica de entrada.
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Buscamos el usuario por username.
    const user = await User.findOne({ username: username.trim() });

    // Si no existe, devolvemos credenciales inválidas.
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Comparamos password ingresado con el hash guardado.
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Si todo está bien, creamos el token.
    const token = createToken(user);

    // Respondemos con token + datos del usuario.
    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta GET /api/auth/me
// Sirve para saber quién está autenticado actualmente.
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user.id viene del token validado por authMiddleware.
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error en /me:', error);
    return res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Exportamos el router y también el middleware para proteger otras rutas.
module.exports = { router, authMiddleware };