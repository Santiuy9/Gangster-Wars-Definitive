import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './css/login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar que los campos no estén vacíos
        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        try {
            // Enviar los datos al backend para iniciar sesión
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                password,
            });

            // Comprobar si el inicio de sesión fue exitoso
            if (response.status === 200) {
                console.log('Inicio de sesión exitoso');

                // Guardar el token en localStorage para futuras solicitudes
                localStorage.setItem('token', response.data.token);

                // Redirigir al usuario a la página principal o dashboard
                navigate('/');
            } else {
                setError('Error al iniciar sesión');
            }
        } catch (error) {
            // Manejar errores de autenticación y otros errores del servidor
            setError(error.response?.data?.message || 'Error al iniciar sesión');
            console.error('Error al iniciar sesión:', error);
        }
    };

    return (
        <div className='PrincipalContainer login-container'>
            <div className="login-form">
                <h3 className='form-title'>Iniciar Sesión</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            id='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password"
                            id='password'
                            placeholder='Contraseña'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className='error-message'>{error}</p>}
                    <div className='form-actions'>
                        <button type='submit' className='login-button'>
                            <span>Iniciar Sesión</span>
                        </button>
                        <Link to='/register' className='register-link'>
                            ¿No tienes una cuenta? Regístrate
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}