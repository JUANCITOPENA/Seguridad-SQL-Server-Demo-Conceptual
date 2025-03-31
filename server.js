// server.js

// 1. Cargar variables de entorno PRIMERO
require('dotenv').config();

// 2. Importar dependencias
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Necesario para ejemplo HTTPS (comentado)
// const https = require('https'); // Necesario para ejemplo HTTPS (comentado)

// 3. Inicializar Express app
const app = express();
const port = process.env.PORT || 3000;

// 4. Configuración de la conexión a SQL Server usando variables de .env
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // <<-- IMPORTANTE para cifrado en tránsito Node.js <-> SQL Server
        trustServerCertificate: true // ¡¡SOLO PARA DESARROLLO LOCAL!! En producción usa false y certificados válidos.
    },
    pool: { // Configuración del pool de conexiones
        max: 10, // Máximo 10 conexiones en el pool
        min: 0,  // Mínimo 0 conexiones
        idleTimeoutMillis: 30000 // Conexiones inactivas se cierran después de 30s
    }
};

// 5. Crear y conectar el pool de conexiones
let pool; // Variable para mantener el pool
async function connectDb() {
    try {
        console.log(`Intentando conectar a SQL Server: ${dbConfig.server}, Base de datos: ${dbConfig.database}...`);
        pool = await new sql.ConnectionPool(dbConfig).connect();
        console.log("¡Conexión a SQL Server establecida exitosamente usando el pool!");

        pool.on('error', err => {
            console.error("Error en el pool de SQL Server:", err);
        });

    } catch (err) {
        console.error("Error FATAL al conectar a la base de datos:", err.message);
        console.error("Verifica: ¿Está corriendo el servicio SQL Server? ¿Están correctas las credenciales en .env? ¿Está habilitado TCP/IP? ¿Permite el firewall la conexión?");
        process.exit(1); // Salir de la aplicación si no se puede conectar
    }
}
// Llamar a la función para conectar al iniciar
connectDb();

// 6. Middlewares
app.use(cors()); // Habilita Cross-Origin Resource Sharing
app.use(express.json()); // Permite al servidor entender bodies de petición en formato JSON
app.use(express.static(path.join(__dirname, 'public'))); // Sirve los archivos estáticos

// 7. Rutas de la API

// --- REGISTRO DE USUARIO (con Hashing) ---
app.post('/api/register', async (req, res) => {
    const { username, password, role = 'user' } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nombre de usuario y contraseña son obligatorios.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        console.log(`Registrando usuario: ${username}, Hash generado (NO guardar en logs reales): ${passwordHash.substring(0, 15)}...`);

        const request = pool.request();
        request.input('Username', sql.NVarChar, username);
        request.input('PasswordHash', sql.NVarChar, passwordHash);
        request.input('Role', sql.NVarChar, role);

        await request.query(
            'INSERT INTO dbo.Users (Username, PasswordHash, Role) VALUES (@Username, @PasswordHash, @Role)'
        );

        console.log(`Usuario '${username}' registrado exitosamente.`);
        res.status(201).json({ message: 'Usuario registrado exitosamente.' });

    } catch (error) {
        console.error("Error durante el registro:", error.message);
        if (error.number === 2627 || (error.originalError && error.originalError.info && error.originalError.info.number === 2627)) {
            res.status(409).json({ message: 'El nombre de usuario ya existe. Por favor, elige otro.' });
        } else {
            res.status(500).json({ message: 'Error interno del servidor durante el registro.' });
        }
    }
});

// --- LOGIN DE USUARIO (con Verificación de Hash) ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nombre de usuario y contraseña son obligatorios.' });
    }

    try {
        const request = pool.request();
        request.input('Username', sql.NVarChar, username);
        const result = await request.query('SELECT UserID, PasswordHash, Role FROM dbo.Users WHERE Username = @Username');

        if (result.recordset.length === 0) {
             console.warn(`Intento de login fallido (usuario no encontrado): ${username}`);
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const user = result.recordset[0];
        const match = await bcrypt.compare(password, user.PasswordHash);

        if (match) {
            console.log(`Login exitoso para usuario: '${username}', Rol: ${user.Role}`);
            // **NOTA IMPORTANTE DE SEGURIDAD:** En prod, generar un TOKEN SEGURO (JWT) aquí.
            res.status(200).json({
                message: 'Login exitoso.',
                userId: user.UserID,
                username: user.Username, // Corrected from user.Username
                role: user.Role
            });
        } else {
             console.warn(`Intento de login fallido (contraseña incorrecta): ${username}`);
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
    } catch (error) {
        console.error("Error durante el login:", error.message);
        res.status(500).json({ message: 'Error interno del servidor durante el login.' });
    }
});

// --- ENDPOINT DEMO RBAC (Obtener todos los usuarios - Solo Admin) ---
app.get('/api/admin/users', async (req, res) => {
    const simulatedUserRole = req.headers['x-simulated-role']; // Usamos un header personalizado PARA LA DEMO
    console.log(`Petición a /api/admin/users recibida. Rol simulado en header: ${simulatedUserRole}`);

    if (!simulatedUserRole || simulatedUserRole.toLowerCase() !== 'admin') {
        console.warn(`Acceso DENEGADO a /api/admin/users. Rol simulado: '${simulatedUserRole}' (se requiere 'admin')`);
        return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }

    try {
        console.log(`Acceso PERMITIDO a /api/admin/users para rol simulado: ${simulatedUserRole}`);
        const result = await pool.request().query('SELECT UserID, Username, Role FROM dbo.Users');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error obteniendo la lista de usuarios (admin):", error.message);
        res.status(500).json({ message: 'Error interno del servidor al obtener usuarios.' });
    }
});

// --- ENDPOINT DEMO STORED PROCEDURE (Actualizar Username) ---
app.post('/api/update-username', async (req, res) => {
    const { userId, newUsername } = req.body;

    if (!userId || !newUsername) {
         return res.status(400).json({ message: 'Se requiere UserID y NewUsername.' });
    }

    try {
        const request = pool.request();
        request.input('UserID', sql.Int, userId);
        request.input('NewUsername', sql.NVarChar, newUsername);

        console.log(`Ejecutando Stored Procedure 'usp_UpdateUsername' para UserID: ${userId}, Nuevo Username: ${newUsername}`);
        const result = await request.execute('dbo.usp_UpdateUsername');
        console.log("Resultado de la ejecución del SP:", result);

        if (result.recordset && result.recordset.length > 0 && result.recordset[0].ResultMessage) {
             res.status(200).json({ message: result.recordset[0].ResultMessage });
        } else {
             res.status(200).json({ message: 'Operación procesada por el Stored Procedure.' });
        }

    } catch (error) {
        console.error(`Error ejecutando Stored Procedure 'usp_UpdateUsername' para UserID ${userId}:`, error.message);
        res.status(400).json({ message: error.message || 'Error al ejecutar la actualización de usuario.' });
    }
});

// 8. Ruta Raíz para servir el Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 9. Iniciar el servidor (HTTP por defecto)
app.listen(port, () => {
    console.log(`------------------------------------------------------`);
    console.log(`Servidor Backend iniciado y escuchando en http://localhost:${port}`); // <<-- HTTP
    // --- NOTA SOBRE HTTPS ---
    // Para habilitar HTTPS (Cifrado en tránsito Navegador <-> Servidor):
    // 1. Necesitarías certificados SSL/TLS (puedes generar autofirmados para local con mkcert).
    // 2. Importar: const https = require('https'); const fs = require('fs');
    // 3. Leer certificados: const options = { key: fs.readFileSync('path/to/key.pem'), cert: fs.readFileSync('path/to/cert.pem') };
    // 4. Crear servidor: https.createServer(options, app).listen(port, () => { ... });
    // 5. Cambiar URL del frontend a https://localhost:${port}
    console.log(`Sirviendo frontend desde: ${path.join(__dirname, 'public')}`);
    console.log(`Usando config .env. Conexión a SQL Server con encrypt=${dbConfig.options.encrypt}.`); // Confirma opción encrypt
    console.log(`¡Abre http://localhost:${port} en tu navegador!`);
    console.log(`------------------------------------------------------`);
});

// -- EJEMPLO DE SERVIDOR HTTPS (Requeriría certificados) --
/*
const httpsOptions = {
  key: fs.readFileSync('path/to/your/private.key'), // Reemplaza con tus rutas
  cert: fs.readFileSync('path/to/your/certificate.crt') // Reemplaza con tus rutas
};
https.createServer(httpsOptions, app).listen(port, () => {
     console.log(`------------------------------------------------------`);
     console.log(`Servidor Backend SEGURO (HTTPS) iniciado y escuchando en https://localhost:${port}`); // <<-- HTTPS
     console.log(`Sirviendo frontend desde: ${path.join(__dirname, 'public')}`);
     console.log(`Usando config .env. Conexión a SQL Server con encrypt=${dbConfig.options.encrypt}.`);
     console.log(`¡Abre https://localhost:${port} en tu navegador!`);
     console.log(`------------------------------------------------------`);
});
*/


// 10. Manejo de cierre limpio
process.on('SIGINT', async () => {
    console.log('\nRecibida señal SIGINT (Ctrl+C). Cerrando conexiones...');
    try {
        if (pool) {
            await pool.close();
            console.log('Pool de conexiones SQL cerrado.');
        }
    } catch (err) {
        console.error('Error al cerrar el pool de SQL:', err);
    }
    process.exit(0);
});