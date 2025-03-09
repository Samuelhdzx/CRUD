document.addEventListener('DOMContentLoaded', function() {
    cargarTareas();
    cargarUsuarios();
    cargarCategorias();
    actualizarEstadisticas();

    // Agregar listener para filtrado
    document.getElementById('filterSelect').addEventListener('change', function(e) {
        if (e.target.value) {
            cargarTareasPorEstado(e.target.value);
        } else {
            cargarTareas();
        }
    });

    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        crearUsuario();
    });
    document.getElementById('categoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        crearCategoria();
    });
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        crearTarea();
    });
});

async function crearUsuario() {
    if (!document.getElementById('userName').value || !document.getElementById('userEmail').value) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    try {
        const response = await fetch('/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value
            })
        });
        const data = await response.json();
        alert('Usuario creado exitosamente');
        document.getElementById('userForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        cargarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear usuario');
    }
}

async function crearCategoria() {
    if (!document.getElementById('categoryName').value || !document.getElementById('categoryColor').value) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    try {
        const response = await fetch('/api/categorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: document.getElementById('categoryName').value,
                color: document.getElementById('categoryColor').value
            })
        });
        const data = await response.json();
        alert('Categoría creada exitosamente');
        document.getElementById('categoryForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
        cargarCategorias();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear categoría');
    }
}

async function crearTarea() {
    if (!document.getElementById('taskTitle').value || !document.getElementById('taskUser').value || !document.getElementById('taskCategory').value || !document.getElementById('taskDueDate').value) {
        alert('Por favor, complete todos los campos.');
        return;
    }
    try {
        const response = await fetch('/api/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: document.getElementById('taskTitle').value,
                descripcion: document.getElementById('taskDescription').value,
                usuario_id: document.getElementById('taskUser').value,
                categoria_id: document.getElementById('taskCategory').value,
                prioridad: document.getElementById('taskPriority').value,
                fecha_vencimiento: document.getElementById('taskDueDate').value,
                estado: 'pendiente'
            })
        });
        const data = await response.json();
        alert('Tarea creada exitosamente');
        document.getElementById('taskForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
        cargarTareas();
        actualizarEstadisticas();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear tarea');
    }
}

async function cargarUsuarios() {
    try {
        const response = await fetch('/api/usuarios');
        const usuarios = await response.json();
        const select = document.getElementById('taskUser');
        select.innerHTML = '<option value="">Seleccione un usuario</option>';
        usuarios.forEach(usuario => {
            select.innerHTML += `<option value="${usuario._id}">${usuario.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

async function cargarCategorias() {
    try {
        const response = await fetch('/api/categorias');
        const categorias = await response.json();
        const select = document.getElementById('taskCategory');
        select.innerHTML = '<option value="">Seleccione una categoría</option>';
        categorias.forEach(categoria => {
            select.innerHTML += `<option value="${categoria._id}">${categoria.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

async function cargarTareas() {
    try {
        const response = await fetch('/api/tareas');
        const tareas = await response.json();
        mostrarTareas(tareas);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
}

async function cargarTareasPorEstado(estado) {
    try {
        const response = await fetch(`/api/tareas/estado/${estado}`);
        const tareas = await response.json();
        mostrarTareas(tareas);
    } catch (error) {
        console.error('Error al filtrar tareas:', error);
    }
}

function mostrarTareas(tareas) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tareas.forEach(tarea => {
        const card = document.createElement('div');
        card.className = `task-card priority-${tarea.prioridad}`;
        card.style.cursor = 'pointer';
        
        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h5 class="mb-1">${tarea.titulo}</h5>
                    <p class="text-muted mb-2">${tarea.descripcion || 'Sin descripción'}</p>
                </div>
                <div class="badge bg-${tarea.estado === 'completada' ? 'success' : 
                                     tarea.estado === 'en_progreso' ? 'warning' : 'secondary'}">
                    ${tarea.estado}
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                    <i class="far fa-calendar me-1"></i>
                    ${new Date(tarea.fecha_vencimiento).toLocaleDateString()}
                </small>
                <div class="task-actions">
                    <button class="btn btn-sm btn-outline-success me-1" onclick="event.stopPropagation(); cambiarEstadoTarea('${tarea._id}')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); eliminarTarea('${tarea._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Agregar evento de clic para mostrar detalles
        card.addEventListener('click', () => mostrarDetallesTarea(tarea));
        
        taskList.appendChild(card);
    });
}

// Función para mostrar detalles de la tarea
async function mostrarDetallesTarea(tarea) {
    try {
        // Corregir la ruta para obtener detalles de tarea
        const response = await fetch(`/api/tareas/${tarea._id}`);
        const tareaActualizada = await response.json();
        
        // Actualizar el contenido del modal
        document.getElementById('detailTitle').textContent = tareaActualizada.titulo;
        document.getElementById('detailDescription').textContent = tareaActualizada.descripcion || 'Sin descripción';
        document.getElementById('detailUser').textContent = tareaActualizada.usuario ? tareaActualizada.usuario.nombre : 'No asignado';
        document.getElementById('detailCategory').textContent = tareaActualizada.categoria ? tareaActualizada.categoria.nombre : 'Sin categoría';
        document.getElementById('detailPriority').textContent = tareaActualizada.prioridad.charAt(0).toUpperCase() + tareaActualizada.prioridad.slice(1);
        document.getElementById('detailStatus').textContent = tareaActualizada.estado.charAt(0).toUpperCase() + tareaActualizada.estado.slice(1);
        document.getElementById('detailCreatedAt').textContent = new Date(tareaActualizada.fecha_creacion).toLocaleDateString();
        document.getElementById('detailDueDate').textContent = new Date(tareaActualizada.fecha_vencimiento).toLocaleDateString();
        
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('taskDetailsModal'));
        modal.show();
    } catch (error) {
        console.error('Error al cargar detalles:', error);
    }
}

async function cambiarEstadoTarea(id) {
    try {
        const tarea = await (await fetch(`/api/tareas/${id}`)).json();
        const estados = ['pendiente', 'en_progreso', 'completada'];
        const estadoActual = estados.indexOf(tarea.estado);
        const nuevoEstado = estados[(estadoActual + 1) % estados.length];
        
        await fetch(`/api/tareas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        
        cargarTareas();
        actualizarEstadisticas();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cambiar estado de la tarea');
    }
}

async function eliminarTarea(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        try {
            // Corregir la ruta para eliminar tarea
            await fetch(`/api/tareas/${id}`, {
                method: 'DELETE'
            });
            cargarTareas();
            actualizarEstadisticas();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar la tarea');
        }
    }
}

async function actualizarEstadisticas() {
    try {
        const response = await fetch('/api/tareas');
        const tareas = await response.json();
        
        const stats = {
            total: tareas.length,
            completadas: tareas.filter(t => t.estado === 'completada').length,
            en_progreso: tareas.filter(t => t.estado === 'en_progreso').length,
            pendientes: tareas.filter(t => t.estado === 'pendiente').length
        };

        const statsCards = document.getElementById('statsCards');
        statsCards.innerHTML = `
            <div class="col-md-3">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <h6>Tareas Totales</h6>
                        <h2>${stats.total}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <h6>Completadas</h6>
                        <h2>${stats.completadas}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <h6>En Progreso</h6>
                        <h2>${stats.en_progreso}</h2>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-danger text-white">
                    <div class="card-body">
                        <h6>Pendientes</h6>
                        <h2>${stats.pendientes}</h2>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
    }
}