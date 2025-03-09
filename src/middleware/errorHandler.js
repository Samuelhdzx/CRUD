const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Error de MongoDB de documento duplicado
    if (err.code === 11000) {
        return res.status(400).json({
            mensaje: 'Error: Registro duplicado',
            error: Object.keys(err.keyValue).map(key => `El ${key} ya existe`).join(', ')
        });
    }

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            mensaje: 'Error de validación',
            error: Object.values(err.errors).map(e => e.message).join(', ')
        });
    }

    // Error de ID inválido
    if (err.name === 'CastError') {
        return res.status(400).json({
            mensaje: 'ID inválido',
            error: 'El formato del ID proporcionado no es válido'
        });
    }

    // Error por defecto
    res.status(500).json({
        mensaje: 'Error del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
};

module.exports = errorHandler;
