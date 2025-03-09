const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        default: '#4a90e2'
    }
}, { timestamps: true });

module.exports = mongoose.model('Categoria', categoriaSchema);
