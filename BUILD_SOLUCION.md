# Si el build se queda congelado o sale "EINVAL readlink"

## Error: EINVAL: invalid argument, readlink '.next\package.json'

Este error suele aparecer en **Windows con la carpeta en OneDrive**. OneDrive puede dejar archivos o “placeholders” que hacen que Next.js falle al leer la carpeta `.next`.

**Qué hacer:**

1. Cierra el servidor de desarrollo (Ctrl+C).
2. Borra la carpeta `.next` en PowerShell:
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   ```
3. Vuelve a levantar:
   ```powershell
   npm run dev
   ```
4. Si el error sigue saliendo, **saca el proyecto de OneDrive**: copia la carpeta del proyecto a una ruta local que no se sincronice (por ejemplo `C:\proyectos\contratos`), abre esa carpeta en Cursor y trabaja desde ahí. Así suele desaparecer el problema.

---

# Si el build se queda congelado

## 1. Cerrar todo y limpiar caché

- Cierra el servidor de desarrollo (Ctrl+C) y cualquier otra terminal que use el proyecto.
- En la carpeta del proyecto ejecuta:

**En PowerShell:**

```powershell
# Borrar carpeta de build
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Opcional: reinstalar dependencias (si sigue fallando)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
```

**En CMD (símbolo del sistema):**

```cmd
rmdir /s /q .next
rmdir /s /q node_modules
del package-lock.json
npm install
```

Luego:

```bash
npm run build
```

## 2. Build con carpeta limpia

```bash
npm run build:clean
```

(Este script borra `.next` y luego ejecuta el build.)

## 3. Probar fuera de OneDrive

Si el proyecto está en **OneDrive** (o en una carpeta sincronizada), el build a veces se congela por sincronización o bloqueo de archivos.

- Copia el proyecto a una carpeta local que **no** esté sincronizada, por ejemplo: `C:\temp\contratos`.
- Abre terminal en esa carpeta y ejecuta:

```bash
npm install
npm run build
```

Si ahí el build termina, el problema suele ser OneDrive. Opciones:

- Trabajar siempre desde una carpeta fuera de OneDrive, o
- Pausar la sincronización de OneDrive mientras haces el build.

## 4. Más memoria para Node

Si tu PC tiene poca RAM o el build se corta por memoria:

```bash
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

## 5. Usar solo el servidor de desarrollo

Si no necesitas generar el build de producción:

```bash
npm run dev
```

La app corre en desarrollo y no hace falta que `npm run build` funcione para trabajar.
