@echo off
title Subir Cambios - CertiWebs
echo ====================================================
echo 🚀 Subiendo cambios de CertiWebs a GitHub...
echo ====================================================
echo.

echo 📂 [1/3] Staging de archivos modificados...
git add .
if %errorlevel% neq 0 (
    echo ❌ Error al agregar archivos.
    goto error
)

echo.
echo 📝 [2/3] Creando confirmacion (commit)...
git commit -m "feat: correccion de huso horario local de Argentina, limpieza de base de datos y redisenio de admin.html"
if %errorlevel% neq 0 (
    echo ⚠️ No hay cambios pendientes por confirmar o error en el commit.
)

echo.
echo 📤 [3/3] Subiendo al repositorio remoto (push)...
git push
if %errorlevel% neq 0 (
    echo ❌ Error al subir cambios (push). Verifica tus credenciales de GitHub.
    goto error
)

echo.
echo ====================================================
echo 🎉 ¡Cambios subidos a GitHub exitosamente!
echo ====================================================
goto end

:error
echo.
echo ❌ Hubo un problema al subir los cambios. Por favor revisa la consola.
echo ====================================================

:end
echo.
pause
