import React, { useState } from 'react';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... lógica de login existente ...
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Bienvenido</h1>
                    <p>Ingresa a tu cuenta para continuar</p>
                </div>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="email" 
                            id="email"
                            placeholder=" "
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <label htmlFor="email">Correo electrónico</label>
                    </div>

                    <div className="form-group">
                        <input 
                            type="password" 
                            id="password"
                            placeholder=" "
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <label htmlFor="password">Contraseña</label>
                    </div>

                    <button type="submit" className="login-button">
                        Iniciar Sesión
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿No tienes una cuenta? <a href="/register">Regístrate</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
