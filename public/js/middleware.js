// Middleware de seguridad para el cliente
const SecurityMiddleware = {
    // Actualizar el token CSRF
    updateCsrfToken: (token) => {
        document.getElementById('csrf-token').content = token;
    },

    // Verificar origen de la respuesta
    validateOrigin: (response) => {
        const origin = response.headers.get('X-Frame-Options');
        if (!origin || origin !== 'DENY') {
            throw new Error('Respuesta no segura');
        }
        return response;
    },

    // Detectar intentos de inyección
    detectInjection: (input) => {
        const dangerous = /[<>{}()$]|javascript:|data:/gi;
        return dangerous.test(input);
    }
};

// Exportar el middleware
window.SecurityMiddleware = SecurityMiddleware;
