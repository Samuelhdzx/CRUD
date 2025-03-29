document.addEventListener('DOMContentLoaded', function() {
    initApp();
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
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
        const response = await fetch('/api/usuarios', {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                AuthService.logout();
                return;
            }
            throw new Error('Error al cargar usuarios');
        }
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
        const response = await fetch('/api/categorias', {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                AuthService.logout();
                return;
            }
            throw new Error('Error al cargar categorías');
        }
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
        const response = await fetch('/api/tareas', {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                AuthService.logout();
                return;
            }
            throw new Error('Error al cargar tareas');
        }
        const tareas = await response.json();
        mostrarTareas(tareas);
    } catch (error) {
        console.error('Error al cargar tareas:', error);
    }
}

async function cargarTareasPorEstado(estado) {
    try {
        const response = await fetch(`/api/tareas/estado/${estado}`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                AuthService.logout();
                return;
            }
            throw new Error('Error al filtrar tareas');
        }
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
        const response = await fetch(`/api/tareas/${tarea._id}`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                AuthService.logout();
                return;
            }
            throw new Error('Error al obtener detalles de la tarea');
        }
        const tareaActualizada = await response.json();
        
        document.getElementById('detailTitle').textContent = tareaActualizada.titulo;
        document.getElementById('detailDescription').textContent = tareaActualizada.descripcion || 'Sin descripción';
        document.getElementById('detailUser').textContent = tareaActualizada.usuario ? tareaActualizada.usuario.nombre : 'No asignado';
        document.getElementById('detailCategory').textContent = tareaActualizada.categoria ? tareaActualizada.categoria.nombre : 'Sin categoría';
        document.getElementById('detailPriority').textContent = tareaActualizada.prioridad.charAt(0).toUpperCase() + tareaActualizada.prioridad.slice(1);
        document.getElementById('detailStatus').textContent = tareaActualizada.estado.charAt(0).toUpperCase() + tareaActualizada.estado.slice(1);
        document.getElementById('detailCreatedAt').textContent = new Date(tareaActualizada.fecha_creacion).toLocaleDateString();
        document.getElementById('detailDueDate').textContent = new Date(tareaActualizada.fecha_vencimiento).toLocaleDateString();
        
        const modal = new bootstrap.Modal(document.getElementById('taskDetailsModal'));
        modal.show();
    } catch (error) {
        console.error('Error al cargar detalles:', error);
    }
}

async function cambiarEstadoTarea(id) {
    try {
        const response = await fetch(`/api/tareas/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                AuthService.logout();
                return;
            }
            throw new Error('Error al actualizar estado');
        }

        const tarea = await response.json();
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
            const response = await fetch(`/api/tareas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${AuthService.getToken()}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    AuthService.logout();
                    return;
                }
                throw new Error('Error al eliminar la tarea');
            }
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
        const response = await fetch('/api/tareas', {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });
        if (!response.ok) {
            if (response.status === 401) {
                AuthService.logout();
                return;
            }
            throw new Error('Error al actualizar estadísticas');
        }
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

function checkAuth() {
    if (!AuthService.isAuthenticated()) {
        renderLoginPage();
        return false;
    }
    return true;
}

function renderLoginPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="auth-container">
            <form class="auth-form" id="loginForm">
                <h2 class="text-center mb-4">Iniciar Sesión</h2>
                <input type="email" class="form-control mb-3" placeholder="Email" required>
                <input type="password" class="form-control mb-3" placeholder="Contraseña" required>
                <button type="submit" class="btn btn-primary w-100 mb-3">Entrar</button>
                <p class="text-center">¿No tienes cuenta? <a href="#" id="showRegister">Regístrate</a></p>
                <div class="auth-error text-danger text-center"></div>
            </form>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const [email, password] = e.target.querySelectorAll('input');
        const result = await AuthService.login(email.value, password.value);
        if (result.success) {
            initApp();
        } else {
            document.querySelector('.auth-error').textContent = result.message;
        }
    });

    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        renderRegisterPage();
    });
}

function renderRegisterPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="auth-container">
            <form class="auth-form" id="registerForm">
                <h2 class="text-center mb-4">Registro</h2>
                <input type="email" class="form-control mb-3" placeholder="Email" required>
                <input type="password" class="form-control mb-3" placeholder="Contraseña" required>
                <input type="password" class="form-control mb-3" placeholder="Confirmar Contraseña" required>
                <button type="submit" class="btn btn-primary w-100 mb-3">Registrarse</button>
                <p class="text-center">¿Ya tienes cuenta? <a href="#" id="showLogin">Iniciar Sesión</a></p>
                <div class="auth-error text-danger text-center"></div>
            </form>
        </div>
    `;

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const [email, password, confirmPassword] = e.target.querySelectorAll('input');
        
        if (password.value !== confirmPassword.value) {
            document.querySelector('.auth-error').textContent = 'Las contraseñas no coinciden';
            return;
        }

        const result = await AuthService.register(email.value, password.value);
        if (result.success) {
            initApp();
        } else {
            document.querySelector('.auth-error').textContent = result.message;
        }
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        renderLoginPage();
    });
}

async function initApp() {
    if (!checkAuth()) return;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <nav class="navbar">
            <div class="container-fluid">
                <span class="navbar-brand">Gestor de Tareas</span>
                <button class="btn btn-outline-light" onclick="AuthService.logout()">Cerrar Sesión</button>
            </div>
        </nav>
        <div class="container">
            <div class="row" id="statsCards"></div>
            <div class="row">
                <div class="col-md-8">
                    <div class="filter-section mb-3">
                        <select id="filterSelect" class="form-select">
                            <option value="">Todas las tareas</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="en_progreso">En Progreso</option>
                            <option value="completada">Completadas</option>
                        </select>
                    </div>
                    <div id="taskList"></div>
                </div>
                <div class="col-md-4">
                    <button class="action-button" data-bs-toggle="modal" data-bs-target="#taskModal">
                        <i class="fas fa-plus me-2"></i> Nueva Tarea
                    </button>
                    <button class="action-button" data-bs-toggle="modal" data-bs-target="#userModal">
                        <i class="fas fa-user me-2"></i> Nuevo Usuario
                    </button>
                    <button class="action-button" data-bs-toggle="modal" data-bs-target="#categoryModal">
                        <i class="fas fa-tag me-2"></i> Nueva Categoría
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Nueva Tarea -->
        <div class="modal fade" id="taskModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nueva Tarea</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="taskForm">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="taskTitle" placeholder="Título" required>
                            </div>
                            <div class="mb-3">
                                <textarea class="form-control" id="taskDescription" placeholder="Descripción"></textarea>
                            </div>
                            <div class="mb-3">
                                <select class="form-control" id="taskUser" required>
                                    <option value="">Seleccionar Usuario</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <select class="form-control" id="taskCategory" required>
                                    <option value="">Seleccionar Categoría</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <select class="form-control" id="taskPriority" required>
                                    <option value="baja">Baja</option>
                                    <option value="media">Media</option>
                                    <option value="alta">Alta</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <input type="date" class="form-control" id="taskDueDate" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Crear Tarea</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Nuevo Usuario -->
        <div class="modal fade" id="userModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nuevo Usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="userForm">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="userName" placeholder="Nombre" required>
                            </div>
                            <div class="mb-3">
                                <input type="email" class="form-control" id="userEmail" placeholder="Email" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Crear Usuario</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Nueva Categoría -->
        <div class="modal fade" id="categoryModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nueva Categoría</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="categoryForm">
                            <div class="mb-3">
                                <input type="text" class="form-control" id="categoryName" placeholder="Nombre" required>
                            </div>
                            <div class="mb-3">
                                <input type="color" class="form-control" id="categoryColor" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Crear Categoría</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Detalles de Tarea -->
        <div class="modal fade" id="taskDetailsModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalles de la Tarea</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <dl>
                            <dt>Título</dt>
                            <dd id="detailTitle"></dd>
                            <dt>Descripción</dt>
                            <dd id="detailDescription"></dd>
                            <dt>Usuario Asignado</dt>
                            <dd id="detailUser"></dd>
                            <dt>Categoría</dt>
                            <dd id="detailCategory"></dd>
                            <dt>Prioridad</dt>
                            <dd id="detailPriority"></dd>
                            <dt>Estado</dt>
                            <dd id="detailStatus"></dd>
                            <dt>Fecha de Creación</dt>
                            <dd id="detailCreatedAt"></dd>
                            <dt>Fecha de Vencimiento</dt>
                            <dd id="detailDueDate"></dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inicializar la aplicación
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
}