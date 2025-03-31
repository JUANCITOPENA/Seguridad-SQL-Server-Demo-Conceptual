// script.js

// URL base del backend
const backendUrl = 'http://localhost:3000'; // CAMBIAR A HTTPS SI SE IMPLEMENTA REALMENTE

// --- Estado Global Simulado ---
let currentUser = null; // { userId: number, username: string, role: string }

// --- Elementos del DOM ---
const loginStatusDiv = document.getElementById('login-status');
const logoutButton = document.getElementById('logout-button');
const registerOutput = document.getElementById('register-output');
const loginOutput = document.getElementById('login-output');
const rbacOutput = document.getElementById('rbac-output');
const spOutput = document.getElementById('sp-output');
const transitStatusDisplay = document.getElementById('transit-status-display');
const encryptionOutput = document.getElementById('encryption-output');
const mfaOutput = document.getElementById('mfa-output');
const alwaysEncryptedOutput = document.getElementById('always-encrypted-output');

// --- Función Auxiliar para Llamadas API ---
async function apiCall(endpoint, method = 'GET', body = null) {
    const url = `${backendUrl}${endpoint}`;
    console.log(`API Call: ${method} ${url}`, body ? body : '');

    clearApiOutputMessages(); // Limpiar outputs de API antes de nueva llamada
    const outputDiv = getOutputDivForApiEndpoint(endpoint); // Obtener div de salida específico de API
    if (outputDiv) showMessage(outputDiv, 'Procesando...', 'processing');

    try {
        const options = {
            method: method,
            headers: {
                ...(body && { 'Content-Type': 'application/json' }),
                ...(currentUser && currentUser.role && endpoint.includes('admin') && { 'X-Simulated-Role': currentUser.role })
            },
            ...(body && { body: JSON.stringify(body) })
        };

        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
            console.error(`Error ${response.status} en ${method} ${url}:`, responseData);
            throw new Error(responseData.message || `Error ${response.status} del servidor.`);
        }

        console.log(`Respuesta OK de ${method} ${url}:`, responseData);
        // Limpiar mensaje de "Procesando..." si hubo éxito antes de mostrar el resultado
         if (outputDiv) showMessage(outputDiv, '', 'info'); // Limpiar antes de mostrar éxito real
        return { success: true, data: responseData };

    } catch (error) {
        console.error(`Error en fetch a ${method} ${url}:`, error);
        // Mostrar el error en el div correspondiente
        if (outputDiv) showMessage(outputDiv, `Error: ${error.message || 'Error de conexión.'}`, 'error');
        // Devolver el error para que la función llamante también lo sepa
        return { success: false, message: error.message || 'Error de conexión o del servidor.' };
    }
}

// --- Funciones Auxiliares de UI ---
function showMessage(element, message, type = 'info') { // type: 'success', 'error', 'info', 'processing'
    if (!element) return;
    element.textContent = message;
    // Reset classes primero
    element.className = 'output'; // Clase base
    // Añadir clase específica del tipo
    if (type === 'success') element.classList.add('success');
    else if (type === 'error') element.classList.add('error');
    else if (type === 'info') element.classList.add('info');
    else if (type === 'processing') element.classList.add('processing');
}

function updateLoginStatusUI() {
    if (currentUser) {
        loginStatusDiv.textContent = `Autenticado como: ${currentUser.username} (Rol: ${currentUser.role}, ID: ${currentUser.userId})`;
        loginStatusDiv.className = 'login-status authenticated';
        logoutButton.style.display = 'inline-block';
    } else {
        loginStatusDiv.textContent = 'Estado: No autenticado';
        loginStatusDiv.className = 'login-status unauthenticated';
        logoutButton.style.display = 'none';
    }
}

// Helper para encontrar el div de salida correcto SOLO para endpoints de API
function getOutputDivForApiEndpoint(endpoint) {
    if (endpoint.startsWith('/api/register')) return registerOutput;
    if (endpoint.startsWith('/api/login')) return loginOutput;
    if (endpoint.startsWith('/api/admin/users')) return rbacOutput;
    if (endpoint.startsWith('/api/update-username')) return spOutput;
    return null;
}

// Helper para limpiar SOLO los mensajes de salida de la API
function clearApiOutputMessages() {
     if (registerOutput) showMessage(registerOutput, '', 'info'); // Limpiar texto y estilo
     if (loginOutput) showMessage(loginOutput, '', 'info');
     if (rbacOutput) showMessage(rbacOutput, '', 'info');
     if (spOutput) showMessage(spOutput, '', 'info');
}

// --- Funciones de Interacción con la API (Existentes) ---
async function registerUser() {
    // clearApiOutputMessages(); // Ya se llama dentro de apiCall
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    if (!username || !password) return showMessage(registerOutput, 'Por favor, completa usuario y contraseña.', 'error');
    if (password.length < 6) return showMessage(registerOutput, 'La contraseña debe tener al menos 6 caracteres.', 'error');

    const result = await apiCall('/api/register', 'POST', { username, password, role });

    if (result.success) {
        showMessage(registerOutput, `Éxito: ${result.data.message}`, 'success');
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
    }
    // El manejo de error ya se hace dentro de apiCall al llamar a showMessage
}

async function loginUser() {
    // clearApiOutputMessages(); // Ya se llama dentro de apiCall
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) return showMessage(loginOutput, 'Por favor, completa usuario y contraseña.', 'error');

    currentUser = null; // Resetear antes del intento
    updateLoginStatusUI();

    const result = await apiCall('/api/login', 'POST', { username, password });

    if (result.success) {
        showMessage(loginOutput, `Éxito: ${result.data.message}`, 'success');
        currentUser = { /* ... (datos del usuario) ... */
             userId: result.data.userId,
            username: result.data.username,
            role: result.data.role
        };
        updateLoginStatusUI();
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    } else {
        // El error ya se mostró por apiCall, solo asegurar que el estado local es nulo
        currentUser = null;
        updateLoginStatusUI();
    }
}

function logoutUser() {
     console.log("Cerrando sesión simulada...");
     currentUser = null;
     updateLoginStatusUI();
     // Limpiar outputs relevantes (opcional, pero bueno)
     if (loginOutput) showMessage(loginOutput, 'Sesión cerrada.', 'info');
     if (rbacOutput) showMessage(rbacOutput, '', 'info'); // Limpiar el de RBAC también
     console.log("Estado de currentUser:", currentUser);
}

async function fetchAdminData() {
    // clearApiOutputMessages(); // Ya se llama dentro de apiCall
    if (!currentUser) return showMessage(rbacOutput, 'Error: Debes iniciar sesión primero.', 'error');

    const result = await apiCall('/api/admin/users', 'GET');

    if (result.success) {
        const userData = result.data.map(user =>
            `  - ID: ${user.UserID}, Usuario: ${user.Username}, Rol: ${user.Role}`
        ).join('\n');
        showMessage(rbacOutput, `Éxito: Lista de Usuarios obtenida:\n${userData}`, 'success');
    }
    // El error (incluido 403) ya lo muestra apiCall
}

async function callUpdateUsernameSP() {
    // clearApiOutputMessages(); // Ya se llama dentro de apiCall
    const userIdInput = document.getElementById('sp-userid');
    const newUsernameInput = document.getElementById('sp-newusername');
    const userId = parseInt(userIdInput.value);
    const newUsername = newUsernameInput.value.trim();

    if (isNaN(userId) || userId <= 0) return showMessage(spOutput, 'Por favor, introduce un UserID válido.', 'error');
    if (!newUsername) return showMessage(spOutput, 'Por favor, introduce el nuevo nombre de usuario.', 'error');

    const result = await apiCall('/api/update-username', 'POST', { userId, newUsername });

    if (result.success) {
        showMessage(spOutput, `Éxito: ${result.data.message}`, 'success');
        newUsernameInput.value = '';
    }
     // El error (incluido el del SP) ya lo muestra apiCall
}

// --- NUEVAS FUNCIONES DE SIMULACIÓN CONCEPTUAL ---

function displayTransitStatus() {
    if (!transitStatusDisplay) return;

    const isHttps = window.location.protocol === "https:";
    const browserToServerStatus = isHttps
        ? '<span class="secure">Segura (HTTPS) 🔒</span>'
        : '<span class="insecure">NO SEGURA (HTTP) ⚠️</span>';
    // Asumimos que encrypt=true está configurado en el backend como se mostró
    const serverToDbStatus = '<span class="db-secure">Cifrada (opción encrypt=true) 🔐</span>';

    transitStatusDisplay.innerHTML = `Navegador ↔ Servidor: ${browserToServerStatus}<br>Servidor ↔ SQL Server: ${serverToDbStatus}`;
    transitStatusDisplay.className = 'transit-status'; // Reset class
}

function simulateSaveSensitiveData() {
    if (!encryptionOutput) return;
    const isHttps = window.location.protocol === "https:";
    const transitSecurity = isHttps ? 'cifrado (HTTPS)' : 'NO cifrado (HTTP)';
    const message = `SIMULACIÓN - Guardado de Dato Sensible:\n` +
                    `1. [Navegador] -> Dato (ej: tarjeta) se envía.\n` +
                    `2. [Tránsito Navegador-Servidor] -> ${transitSecurity}. 🔒\n` +
                    `3. [Servidor Node.js] -> Recibe dato.\n` +
                    `4. [Tránsito Servidor-BD] -> Cifrado (encrypt=true). 🔐\n` +
                    `5. [SQL Server - Reposo] -> Dato guardado en disco.\n`+
                    `   - Si TDE activo: Todo el archivo de BD cifrado.\n` +
                    `   - Si Cifrado de Columna/AE: Columna específica cifrada.\n` +
                    `Resultado: Protección en múltiples capas.`;
    showMessage(encryptionOutput, message, 'info');
}

function simulateMFA() {
     if (!mfaOutput) return;
    const message = `SIMULACIÓN - Flujo Login con MFA:\n`+
                    `1. Usuario -> user/pass.\n` +
                    `2. Backend -> Verifica pass (OK).\n` +
                    `3. Backend -> Requiere 2º Factor.\n` +
                    `4. Frontend -> Pide código (ej: App Auth).\n` +
                    `5. Usuario -> introduce código.\n` +
                    `6. Backend -> Verifica código TOTP (OK).\n` +
                    `7. Backend -> Login completo ✅ Genera sesión/token.\n` +
                    `Resultado: Autenticación reforzada.`;
     showMessage(mfaOutput, message, 'info');
}

function simulateAlwaysEncrypted() {
     if (!alwaysEncryptedOutput) return;
     const message = `SIMULACIÓN - Consulta con Always Encrypted:\n` +
                     `   (Buscar cliente por DNI cifrado)\n` +
                     `1. App Backend: SELECT ... WHERE DNI = '12345678Z';\n` +
                     `2. Driver AE (en Backend): Detecta col DNI cifrada.\n` +
                     `3. Driver AE: Cifra '12345678Z' -> 0xABCDEF...\n` +
                     `4. Driver AE -> BD: SELECT ... WHERE DNI = 0xABCDEF...;\n` +
                     `5. BD: Ejecuta consulta sobre datos cifrados.\n` +
                     `6. BD -> Driver AE: Devuelve fila(s) (Nombre puede o no estar cifrado).\n` +
                     `7. Driver AE: Si Nombre cifrado, lo descifra.\n` +
                     `8. Driver AE -> App Backend: Entrega Nombre en claro.\n` +
                     `Resultado: DNI nunca viaja ni se procesa en claro en la BD. ✨`;
     showMessage(alwaysEncryptedOutput, message, 'info');
}


// --- Inicialización al Cargar la Página ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Frontend cargado. Listo para interactuar con:", backendUrl);
    updateLoginStatusUI(); // Estado inicial login
    displayTransitStatus(); // Muestra estado HTTPS/Conexión DB simulado
    // Limpiar todos los outputs al inicio para empezar limpio
    document.querySelectorAll('.output').forEach(el => showMessage(el, '', 'info'));
});