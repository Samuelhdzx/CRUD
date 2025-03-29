class AuthService {
    static isAuthenticated() {
        return localStorage.getItem('token') !== null;
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static removeToken() {
        localStorage.removeItem('token');
    }

    static async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.token) {
                this.setToken(data.token);
                return { success: true };
            }
            
            return { 
                success: false, 
                message: data.message || 'Error al iniciar sesión'
            };
        } catch (error) {
            console.error('Error de login:', error);
            return { 
                success: false, 
                message: 'Error de conexión al servidor'
            };
        }
    }

    static async register(email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.token) {
                this.setToken(data.token);
                return { success: true };
            }
            
            return { 
                success: false, 
                message: data.message || 'Error al registrarse'
            };
        } catch (error) {
            console.error('Error de registro:', error);
            return { 
                success: false, 
                message: 'Error de conexión al servidor'
            };
        }
    }

    static logout() {
        this.removeToken();
        window.location.href = '/';
    }
}
