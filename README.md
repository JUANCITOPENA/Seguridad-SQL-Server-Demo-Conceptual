# Demo Educativa: Desarrollo Seguro Backend (Node.js + SQL Server) 🛡️🚀

[![Estado del Repo](https://img.shields.io/badge/Estado-Educativo_/_Demo-blue)](https://github.com/TU_USUARIO_GITHUB/NOMBRE_DEL_REPO) <!-- ¡Reemplaza con tu usuario y repo! -->
[![Licencia](https://img.shields.io/badge/Licencia-MIT-green)](./LICENSE) <!-- Puedes añadir un archivo LICENSE si quieres -->

## 👨‍🏫 De la Charla a la Práctica: Una Demo para Aprender Juntos 💡

¡Hola a todos! 👋

Hace unos días, tuve el placer de participar como invitado en una clase enfocada en las **buenas prácticas para el desarrollo de aplicaciones seguras**. Dentro de los temas, me tocó explorar tecnologías robustas como **SQL Server** y, como soy un apasionado de la programación web y especialmente de **JavaScript**, no pude evitar hablar de cómo **Node.js** y **Express** se integran en este ecosistema para construir backends modernos.

Durante la sesión, mientras discutíamos la teoría detrás de conceptos vitales de seguridad, surgió la necesidad de **aterrizar esas ideas en un ejemplo práctico y tangible**. Me di cuenta de que, más allá de las diapositivas, tener un código funcional que los estudiantes y entusiastas pudieran **ver, ejecutar y modificar** sería una herramienta de aprendizaje mucho más poderosa.

Este repositorio es, en esencia, el resultado (un poco más, un poco menos 😉) de ese ejercicio: una **demo funcional** diseñada específicamente para ilustrar, de manera interactiva, los conceptos de seguridad que abordamos. La idea es mostrar *cómo* se aplican estas técnicas en un entorno real (simulado, claro está) usando las tecnologías que mencionamos.

**Y es que, como comentamos en la sesión...** 🚀

En el mundo digital actual, la seguridad de los datos se ha convertido en una prioridad más crítica que nunca. Ya sea que estés desarrollando una aplicación, analizando información sensible o administrando una base de datos, la protección de los datos debe estar siempre en el primer lugar de tu lista de tareas.

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

---

## ⚠️ Disclaimer Importante y Nota sobre Tecnologías

Esta es una **demo con fines exclusivamente educativos**. Nació de la necesidad de ilustrar conceptos de seguridad durante una charla, utilizando las herramientas disponibles en ese momento.

**Nota sobre SQL Server:** Es bueno recordar que el uso de **SQL Server** en esta demo fue una elección basada en la disponibilidad y familiaridad durante la preparación de la charla, y dado el poco tiempo. ¡No es necesariamente la opción más "habitual" para todos los proyectos Node.js! Existen muchas otras excelentes opciones de bases de datos (relacionales como **MySQL**, **PostgreSQL**; NoSQL como **MongoDB**) y plataformas de bases de datos en la nube (Azure SQL Database, AWS RDS, Google Cloud SQL, Vercel Postgres, PlanetScale, MongoDB Atlas, etc.). **La idea es que estos principios de seguridad son aplicables independientemente de la base de datos específica**, aunque la implementación de algunos detalles (como el cifrado en reposo o la sintaxis exacta) variará. **En un ambiente real, la elección tecnológica debe ajustarse cuidadosamente a los requisitos, escala, presupuesto y ecosistema del proyecto.**

**Para un entorno de producción real, se requiere un endurecimiento significativo, incluyendo (pero no limitado a):**

*   **HTTPS Obligatorio:** Configurar certificados SSL/TLS válidos en el servidor Node.js (o a través de un proxy inverso como Nginx/Apache).
*   **Gestión Segura de Secretos:** No hardcodear credenciales ni secretos; usar variables de entorno gestionadas de forma segura (ej: Azure Key Vault, AWS Secrets Manager, HashiCorp Vault, secretos de la plataforma de despliegue).
*   **Manejo de Errores Robusto:** Implementar un manejo de errores más detallado y evitar filtrar información sensible en los mensajes de error expuestos al cliente.
*   **Rate Limiting y Protección DoS:** Implementar medidas para prevenir abuso y ataques de denegación de servicio (ej: `express-rate-limit`).
*   **Pruebas de Seguridad:** Realizar pruebas de penetración (Pen Testing) y análisis de vulnerabilidades de forma regular.
*   **Logging y Monitorización Avanzados:** Usar sistemas de logging centralizados (ELK Stack, Splunk, Datadog) y monitorización de seguridad activa.
*   **Configuración de CORS más Restrictiva:** Ajustar el origen permitido en `cors` a tu dominio(s) de producción específico(s).
*   **Política de Contraseñas Fuerte:** Implementar requisitos de complejidad, historial y rotación de contraseñas si manejas autenticación propia.
*   **Auditoría Formal:** Configurar auditoría detallada en la base de datos (si aplica) y registrar eventos de seguridad clave en la aplicación.
*   **Dependencias Actualizadas:** Mantener todas las dependencias (`npm audit`) actualizadas y parcheadas.
*   **Configuración Segura del Servidor/Plataforma:** Asegurar la configuración del sistema operativo, la red y la plataforma de despliegue.

---

¡Esperamos que esta demo te sea útil para aprender y aplicar mejores prácticas de seguridad en tus propios proyectos! ¡Feliz codificación segura! 🎉
