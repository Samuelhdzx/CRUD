const actualizarEstado = async (id) => {
    try {
        const response = await fetch(`/api/tareas/${id}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Actualizar el estado en la interfaz
            // Puedes usar setState si estás usando React
            // O actualizar tu store si usas Redux/Vuex
        }
    } catch (error) {
        console.error('Error al actualizar estado:', error);
    }
};
