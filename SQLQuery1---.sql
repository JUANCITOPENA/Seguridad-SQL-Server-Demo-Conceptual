-- 1. Crear la Base de Datos (si no existe)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SecurityDemoDB')
BEGIN
    CREATE DATABASE SecurityDemoDB;
END
GO

USE SecurityDemoDB;
GO

-- 2. Crear la Tabla de Usuarios
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
    DROP TABLE dbo.Users;
GO

CREATE TABLE dbo.Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(200) NOT NULL, -- Para almacenar el hash bcrypt
    Role NVARCHAR(50) NOT NULL DEFAULT 'user' -- Para RBAC simple (user, admin)
);
GO

-- 3. Insertar un usuario de ejemplo (opcional, mejor registrar desde la app)
-- ¡NO HAGAS ESTO EN PRODUCCIÓN! Usar bcrypt aquí es solo para ejemplo inicial.
-- La contraseña 'adminpass' hasheada con bcrypt (coste 10) - ¡Genera la tuya!
-- Puedes usar una herramienta online o la app Node.js para generar el primer hash.
-- Ejemplo de hash para 'adminpass': $2b$10$SOMEBCRYPTSALTANDHASHDATA...
-- INSERT INTO dbo.Users (Username, PasswordHash, Role)
-- VALUES ('admin', '$2b$10$YOUR_GENERATED_BCRYPT_HASH_HERE', 'admin');
-- GO

-- 4. Crear Procedimiento Almacenado para actualizar Username (más seguro que SQL directo)
IF OBJECT_ID('dbo.usp_UpdateUsername', 'P') IS NOT NULL
    DROP PROCEDURE dbo.usp_UpdateUsername;
GO

CREATE PROCEDURE dbo.usp_UpdateUsername
    @UserID INT,
    @NewUsername NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar si el nuevo username ya existe (excepto para el propio usuario)
    IF EXISTS (SELECT 1 FROM dbo.Users WHERE Username = @NewUsername AND UserID != @UserID)
    BEGIN
        -- Lanzar un error personalizado o devolver un código de error
        RAISERROR ('El nombre de usuario ya está en uso por otro usuario.', 16, 1);
        RETURN; -- Importante salir
    END

    -- Actualizar el nombre de usuario
    UPDATE dbo.Users
    SET Username = @NewUsername
    WHERE UserID = @UserID;

    -- Verificar si la actualización tuvo éxito (opcional)
    IF @@ROWCOUNT = 0
    BEGIN
         RAISERROR ('Usuario no encontrado.', 16, 1);
         RETURN;
    END

    -- Devolver éxito (opcional)
    SELECT 'Nombre de usuario actualizado correctamente' AS Result;

END
GO

PRINT 'Base de datos SecurityDemoDB y objetos creados correctamente.';