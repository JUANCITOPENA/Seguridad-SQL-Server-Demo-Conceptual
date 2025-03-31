-- setup_database.sql

-- Ensure connected to the correct SQL Server instance with adequate permissions.

-- 1. Create Database if it doesn't exist
USE master;
GO
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SecurityDemoDB')
BEGIN
    CREATE DATABASE SecurityDemoDB;
    PRINT 'Base de datos SecurityDemoDB CREADA.';
END
ELSE
BEGIN
    PRINT 'Base de datos SecurityDemoDB ya existe.';
END
GO

-- 2. Switch to the Database context
USE SecurityDemoDB;
GO

-- 3. Create Users Table (Dropping if exists for demo idempotency)
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.Users;
    PRINT 'Tabla Users existente ELIMINADA.';
END
GO
CREATE TABLE dbo.Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL UNIQUE, -- Must be unique
    PasswordHash NVARCHAR(200) NOT NULL,    -- Store bcrypt hash
    Role NVARCHAR(50) NOT NULL DEFAULT 'user' CHECK (Role IN ('user', 'admin')) -- Enforce roles
);
PRINT 'Tabla Users CREADA.';
GO

-- --- SECURITY NOTE: Least Privilege ---
-- Instead of using a high-privilege login like 'sa' or giving 'JUANCITO' broad permissions (db_owner),
-- in a production environment, create a specific login/user for the application with ONLY the necessary permissions:
-- E.g., CREATE USER AppUser FOR LOGIN YourAppLogin;
--       GRANT SELECT, INSERT, UPDATE ON dbo.Users TO AppUser;
--       GRANT EXECUTE ON dbo.usp_UpdateUsername TO AppUser;
-- This minimizes the damage if the application's credentials are compromised.
-- ---

-- --- SECURITY NOTE: Auditing ---
-- SQL Server has built-in auditing features. You can configure server or database audit specifications
-- to log events like logins, failed logins, DDL changes, data modifications (SELECT, INSERT, UPDATE, DELETE)
-- on specific tables (like dbo.Users). This is crucial for security monitoring and incident response.
-- Example (Conceptual - requires more setup):
-- CREATE SERVER AUDIT SPECIFICATION [User_Actions_Audit_Spec]
-- FOR SERVER AUDIT [Your_Audit_Destination]
-- ADD (DATABASE_OBJECT_CHANGE_GROUP),
-- ADD (SCHEMA_OBJECT_CHANGE_GROUP)
-- WITH (STATE = ON);
-- ---

-- --- SECURITY NOTE: Encryption at Rest ---
-- TDE (Transparent Data Encryption): Encrypts the entire database files.
-- ALTER DATABASE SecurityDemoDB SET ENCRYPTION ON; -- Requires Master Key/Certificate setup.
-- Column-Level Encryption / Always Encrypted: Encrypt specific sensitive columns. Requires key setup (CMK, CEK).
-- ---

-- 4. Create Stored Procedure for updating username
IF OBJECT_ID('dbo.usp_UpdateUsername', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.usp_UpdateUsername;
    PRINT 'Stored Procedure usp_UpdateUsername existente ELIMINADO.';
END
GO
CREATE PROCEDURE dbo.usp_UpdateUsername
    @UserID INT,
    @NewUsername NVARCHAR(100) -- Input Parameter
AS
BEGIN
    SET NOCOUNT ON;

    -- Input Validation (Basic check within SP - more robust validation in backend code)
    IF @NewUsername IS NULL OR LTRIM(RTRIM(@NewUsername)) = ''
    BEGIN
        RAISERROR('El nuevo nombre de usuario no puede estar vacío.', 16, 1);
        RETURN;
    END

    -- Check if the new username is already taken by ANOTHER user
    IF EXISTS (SELECT 1 FROM dbo.Users WHERE Username = @NewUsername AND UserID != @UserID)
    BEGIN
        RAISERROR ('El nuevo nombre de usuario ya está en uso por otro usuario.', 16, 1);
        RETURN;
    END

    -- Perform the update
    UPDATE dbo.Users
    SET Username = @NewUsername
    WHERE UserID = @UserID;

    -- Check if the update affected any row (i.e., if UserID existed)
    IF @@ROWCOUNT = 0
    BEGIN
         RAISERROR ('Usuario con el ID especificado no encontrado.', 16, 1);
         RETURN;
    END
    -- Return success message (optional)
    SELECT 'Nombre de usuario actualizado correctamente' AS ResultMessage;
END
GO
PRINT 'Stored Procedure usp_UpdateUsername CREADO.';
GO

PRINT '*** Configuración de la Base de Datos COMPLETADA. ***';