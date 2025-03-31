# Demo Educativa: Desarrollo Seguro Backend (Node.js + SQL Server) 🛡️🚀

[![Estado del Repo](https://img.shields.io/badge/Estado-Educativo_/_Demo-blue)](https://github.com/TU_USUARIO_GITHUB/NOMBRE_DEL_REPO) <!-- ¡Reemplaza con tu usuario y repo! -->
[![Licencia](https://img.shields.io/badge/Licencia-MIT-green)](./LICENSE) <!-- Puedes añadir un archivo LICENSE si quieres -->

## 💡 Introducción: ¡Protege Tus Datos Como un Pro! 🔒

¡Saludos, desarrolladores y entusiastas de la seguridad! 👋 Inspirado en la importancia de proteger nuestros datos, este repositorio presenta una **demo funcional y educativa** diseñada para ilustrar conceptos clave de seguridad en el desarrollo de software backend, utilizando Node.js y SQL Server.

🌟 Como bien sabemos, en el mundo digital actual, la seguridad de los datos se ha convertido en una prioridad más crítica que nunca. Ya sea que estés desarrollando una aplicación, analizando información sensible o administrando una base de datos, la protección de los datos debe estar siempre en el primer lugar de tu lista de tareas. 🚀

**¿Por qué es tan importante? 🤔**

*   **Confidencialidad:** Mantenemos los datos lejos de ojos curiosos. 🔍
*   **Integridad:** Garantizamos que la información no sea alterada ni corrompida. 🔏
*   **Disponibilidad:** Nos aseguramos de que los datos estén accesibles cuando realmente se necesiten. 🌐
*   **Cumplimiento normativo:** Evitamos las multas y sanciones con buenas prácticas de protección de datos. 📜

Este proyecto te ayudará, especialmente si eres nuevo en estos temas, a entender y visualizar cómo implementar diversas técnicas de seguridad.

---

## 🎯 Objetivo de la Demo

El objetivo principal es **ilustrar de forma práctica** diversas técnicas y conceptos modernos para construir aplicaciones backend más seguras. **No** es una plantilla lista para producción, sino una herramienta de aprendizaje interactiva.

---

## ✨ Técnicas y Conceptos Demostrados

Esta demo cubre (implementa o simula conceptualmente) las siguientes prácticas de seguridad:

*   **Hashing con Sal 🔑:** Protección de contraseñas usando `bcrypt` (la sal se genera e incluye automáticamente).
*   **Sesiones Seguras con Tokens JWT 🍪:** Autenticación basada en JSON Web Tokens almacenados en cookies `HttpOnly` y `Secure`.
*   **Validación de Entradas Rigurosa ✅:** Uso de `express-validator` para validar y sanear datos de entrada en el backend.
*   **Control de Acceso Basado en Roles (RBAC) 👥:** Autorización basada en roles definidos en el payload del JWT.
*   **Procedimientos Almacenados (SPs) Seguros 🗄️:** Uso de Stored Procedures parametrizados en SQL Server para prevenir Inyección SQL.
*   **Protección contra Ataques Comunes 🛡️:**
    *   Uso de `helmet` para configurar cabeceras HTTP de seguridad (contra XSS, clickjacking, etc.).
    *   Uso de `csurf` para prevenir ataques Cross-Site Request Forgery (CSRF).
*   **Cifrado en Tránsito ↔️:**
    *   Conceptualización de HTTPS para la conexión Navegador ↔ Servidor.
    *   Implementación de conexión cifrada Servidor ↔ SQL Server (`encrypt=true`).
*   **Cifrado en Reposo 💾:** Conceptualización de TDE (Transparent Data Encryption) y Cifrado a Nivel de Columna en SQL Server.
*   **Autenticación Multifactor (MFA) 🔒:** Simulación conceptual del flujo de MFA.
*   **Always Encrypted ✨:** Simulación conceptual de esta característica de SQL Server.
*   **Principio de Menor Privilegio 📉:** Explicación conceptual y comentarios en el script SQL sobre la configuración de permisos mínimos necesarios.
*   **Actualizaciones y Parches 🩹:** Mención de la importancia y cómo usar `npm audit`.
*   **Auditoría y Logs 📝:** Simulación básica de logs de auditoría en la consola del backend y mención de herramientas/prácticas robustas.

---

## 🛠️ Tecnologías Utilizadas

*   **Backend:** Node.js, Express.js
*   **Base de Datos:** SQL Server
*   **Frontend:** HTML, CSS, JavaScript (Vanilla)
*   **Librerías Clave de Seguridad/Utilidad:**
    *   `bcrypt`: Hashing de contraseñas.
    *   `jsonwebtoken`: Creación y verificación de JWT.
    *   `cookie-parser`: Manejo de cookies (para JWT y CSRF).
    *   `express-validator`: Validación de entradas.
    *   `helmet`: Cabeceras HTTP de seguridad.
    *   `csurf`: Protección CSRF.
    *   `mssql`: Driver de SQL Server para Node.js.
    *   `dotenv`: Manejo de variables de entorno.
    *   `cors`: Configuración de Cross-Origin Resource Sharing.

---

## 🚀 Cómo Ejecutar la Demo Localmente

Sigue estos pasos para poner en marcha la demo en tu máquina:

1.  **Clonar o Descargar:**
    ```bash
    git clone https://github.com/JUANCITOPENA/Seguridad-SQL-Server-Demo-Conceptual # ¡Reemplaza!
    cd NOMBRE_DEL_REPO
    ```
    O descarga el ZIP y descomprímelo.

2.  **Configurar SQL Server:**
    *   Asegúrate de tener una instancia de SQL Server corriendo (la demo usa `DESKTOP-M6PHA8P\SQLEXPRESS` por defecto, ajústalo en `.env` si es diferente).
    *   Conéctate a tu instancia SQL Server usando SSMS, Azure Data Studio, etc.
    *   Abre y **ejecuta el script completo** `setup_database.sql` para crear la base de datos (`SecurityDemoDB`), la tabla `Users` y el Stored Procedure `usp_UpdateUsername`.
    *   Verifica que el usuario SQL (`JUANCITO` en el ejemplo `.env`) tenga los permisos necesarios sobre la base de datos `SecurityDemoDB` (al menos `db_datareader`, `db_datawriter`, y `EXECUTE` en el SP).

3.  **Configurar Variables de Entorno:**
    *   Crea un archivo llamado `.env` en la raíz del proyecto.
    *   Copia el contenido del archivo `.env.example` (si lo incluyes) o usa la estructura del código `server.js`:
        ```ini
        # .env
        DB_SERVER=TU_SERVIDOR_SQL\INSTANCIA # Ej: DESKTOP-M6PHA8P\SQLEXPRESS
        DB_DATABASE=SecurityDemoDB
        DB_USER=TU_USUARIO_SQL            # Ej: JUANCITO
        DB_PASSWORD=TU_CONTRASEÑA_SQL       # Ej: 123456 (¡Usa una segura para pruebas!)

        PORT=3000

        # ¡¡MUY IMPORTANTE!! Genera tu propio secreto JWT seguro y largo.
        # Ejecuta en tu terminal: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
        JWT_SECRET=PEGA_AQUI_TU_SECRETO_GENERADO_DE_64_BYTES_HEX
        ```
    *   **¡Asegúrate de generar un `JWT_SECRET` fuerte y único!**

4.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

5.  **Iniciar el Backend:**
    ```bash
    node server.js
    ```
    *   Revisa la consola. Deberías ver mensajes indicando que la conexión a la BD fue exitosa y que el servidor está escuchando en `http://localhost:3000`.

6.  **Acceder al Frontend:**
    *   Abre tu navegador web y ve a `http://localhost:3000`.

---

## 🧪 Qué Explorar en la Demo

Una vez que la aplicación esté corriendo:

*   **Registro y Login:** Crea usuarios (user/admin), inicia y cierra sesión. Observa los logs "AUDIT:" en la consola del backend y las cookies (`authToken`, `_csrf`) en las herramientas de desarrollador del navegador.
*   **Validación:** Intenta registrarte con datos inválidos (contraseña corta, username vacío) y observa los errores devueltos por el backend.
*   **RBAC:** Loguéate como 'user' e intenta acceder a la lista de usuarios (fallará). Loguéate como 'admin' e inténtalo de nuevo (funcionará).
*   **Stored Procedure:** Actualiza el nombre de un usuario (el tuyo propio o el de otro si eres admin). Intenta usar un nombre ya existente para ver el error del SP.
*   **CSRF:** La protección está activa. Todas las acciones POST (Registro, Login, Logout, Update Username) requieren y usan automáticamente el token CSRF obtenido al inicio.
*   **Helmet:** Usa las herramientas de desarrollador del navegador (pestaña Red/Network) para inspeccionar las cabeceras de respuesta HTTP y ver las que añade Helmet.
*   **Secciones Conceptuales:** Haz clic en los botones "Simular..." para leer las explicaciones detalladas de cada concepto.
*   **Logs de Auditoría:** Revisa la salida de la consola del backend (`node server.js`) para ver los logs simulados con el prefijo `AUDIT:`.

---

## ⚠️ Disclaimer Importante

Esta es una **demo con fines exclusivamente educativos**. Para un entorno de producción real, se requiere un endurecimiento significativo, incluyendo (pero no limitado a):

*   **HTTPS Obligatorio:** Configurar certificados SSL/TLS válidos en el servidor Node.js (o a través de un proxy inverso como Nginx/Apache).
*   **Gestión Segura de Secretos:** No hardcodear credenciales ni secretos; usar variables de entorno gestionadas de forma segura (ej: Azure Key Vault, AWS Secrets Manager, HashiCorp Vault).
*   **Manejo de Errores Robusto:** Implementar un manejo de errores más detallado y evitar filtrar información sensible en los mensajes de error.
*   **Rate Limiting y Protección DoS:** Implementar medidas para prevenir abuso y ataques de denegación de servicio.
*   **Pruebas de Seguridad:** Realizar pruebas de penetración y análisis de vulnerabilidades.
*   **Logging y Monitorización Avanzados:** Usar sistemas de logging centralizados y monitorización de seguridad.
*   **Configuración de CORS más Restrictiva:** Ajustar el origen permitido en `cors` a tu dominio de producción específico.
*   **Política de Contraseñas Fuerte:** Implementar requisitos de complejidad y rotación de contraseñas.
*   **Auditoría Formal:** Configurar auditoría detallada en SQL Server y en la aplicación.

---

¡Esperamos que esta demo te sea útil para aprender y aplicar mejores prácticas de seguridad en tus propios proyectos! ¡Feliz codificación segura! 🎉
