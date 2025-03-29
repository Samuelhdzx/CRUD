const actualizarEstado = async (id) => {
    try {
        const token = localStorage.getItem('token'); // Obtener el token de autenticación
        const response = await fetch(`/api/tareas/${id}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error en la actualización');
        }

        // Actualizar el estado en la interfaz
        // Puedes usar setState si estás usando React
        // O actualizar tu store si usas Redux/Vuex
    } catch (error) {
        console.error('Error al actualizar estado:', error);
    }
};

const obtenerTareas = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/tareas', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener tareas');
        }

        const tareas = await response.json();
        // Actualizar el estado con las tareas
        setTareas(tareas);
    } catch (error) {
        console.error('Error:', error);
    }
};

const crearTarea = async (tareaDatos) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tareaDatos)
        });
        
        if (!response.ok) {
            throw new Error('Error al crear la tarea');
        }

        const nuevaTarea = await response.json();
        // Actualizar el estado local con la nueva tarea
        setTareas(tareas => [...tareas, nuevaTarea]);
        
    } catch (error) {
        console.error('Error:', error);
    }
};
