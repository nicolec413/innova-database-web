// CONFIGURACIÓN DE SUPABASE - PROYECTO NICOLE SALAZAR
const SUPABASE_URL = "https://rnrqwbbflpjquyjvipml.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucnF3YmJmbHBqcXV5anZpcG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MjEyMzEsImV4cCI6MjA5NzQ5NzIzMX0.E7X68ROTKhLyGCVHlV_gdutImCrO5KSi-JYp9Y-btGM"; 

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Referencias del DOM - Autenticación
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const authMessage = document.getElementById('auth-message');
const userEmailDisplay = document.getElementById('user-email-display');
const btnLogout = document.getElementById('btn-logout');

// Referencias del DOM - Secciones
const authSection = document.getElementById('auth-section');
const dataSection = document.getElementById('data-section');

// Referencias del DOM - Tablas
const btnShowProductos = document.getElementById('btn-show-productos');
const btnShowClientes = document.getElementById('btn-show-clientes');
const tableHead = document.getElementById('table-head');
const tableBody = document.getElementById('table-body');

// Alternar entre pestañas de Login y Registro
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    authMessage.textContent = '';
});

tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
    authMessage.textContent = '';
});

// Registro de usuarios
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    authMessage.style.color = 'var(--text-main)';
    authMessage.textContent = "Procesando...";
    
    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        authMessage.style.color = 'var(--error)';
        authMessage.textContent = `Error: ${error.message}`;
    } else {
        authMessage.style.color = 'var(--success)';
        authMessage.textContent = "Registro exitoso. Ya puede intentar iniciar sesión.";
        formRegister.reset();
    }
});

// Inicio de Sesión
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    authMessage.style.color = 'var(--text-main)';
    authMessage.textContent = "Verificando...";

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        authMessage.style.color = 'var(--error)';
        authMessage.textContent = `Error: ${error.message}`;
    } else {
        authMessage.style.color = 'var(--success)';
        authMessage.textContent = "Conexión exitosa.";
        formLogin.reset();
        checkUserSession();
    }
});

// Cerrar Sesión
btnLogout.addEventListener('click', async () => {
    await _supabase.auth.signOut();
    checkUserSession();
});

// Monitorear Estado de la Sesión
async function checkUserSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    
    if (session) {
        userEmailDisplay.textContent = `Sesión: ${session.user.email}`;
        btnLogout.classList.remove('hidden');
        authSection.classList.add('hidden');
        dataSection.classList.remove('hidden');
        loadProductos();
    } else {
        userEmailDisplay.textContent = "Usuario no autenticado";
        btnLogout.classList.add('hidden');
        authSection.classList.remove('hidden');
        dataSection.classList.add('hidden');
    }
}

// Cargar y mostrar Productos
async function loadProductos() {
    btnShowProductos.classList.add('active');
    btnShowClientes.classList.remove('active');
    
    tableHead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
        </tr>
    `;
    tableBody.innerHTML = '<tr><td colspan="5">Cargando productos...</td></tr>';

    const { data, error } = await _supabase
        .from('productos')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        tableBody.innerHTML = `<tr><td colspan="5">Error: ${error.message}</td></tr>`;
    } else {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No hay productos registrados.</td></tr>';
            return;
        }
        data.forEach(item => {
            tableBody.innerHTML += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion}</td>
                    <td>$${parseFloat(item.precio).toFixed(2)}</td>
                    <td>${item.stock}</td>
                </tr>
            `;
        });
    }
}

// Cargar y mostrar Clientes
async function loadClientes() {
    btnShowClientes.classList.add('active');
    btnShowProductos.classList.remove('active');

    tableHead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Ciudad</th>
        </tr>
    `;
    tableBody.innerHTML = '<tr><td colspan="5">Cargando clientes...</td></tr>';

    const { data, error } = await _supabase
        .from('clientes')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        tableBody.innerHTML = `<tr><td colspan="5">Error: ${error.message}</td></tr>`;
    } else {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No hay clientes registrados.</td></tr>';
            return;
        }
        data.forEach(item => {
            tableBody.innerHTML += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.nombre}</td>
                    <td>${item.email}</td>
                    <td>${item.telefono || 'N/A'}</td>
                    <td>${item.ciudad || 'N/A'}</td>
                </tr>
            `;
        });
    }
}

// Controladores de eventos de las pestañas de datos
btnShowProductos.addEventListener('click', loadProductos);
btnShowClientes.addEventListener('click', loadClientes);

// Ejecutar al iniciar la página
checkUserSession();
