---
title: "Configuración de CI/CD"
description: "Configura los secrets de GitHub Actions para el pipeline de release automatizado."
---

Esta guía explica cómo configurar los secrets de GitHub Actions requeridos para el pipeline de release automatizado. Sin estos secrets, el workflow de release fallará.

## Secrets Requeridos

El workflow de release requiere los siguientes secrets configurados en tu repositorio:

### 1. Token de GitHub App (Requerido para Release)

El workflow de release utiliza una **GitHub App** en lugar de `GITHUB_TOKEN` para crear pull requests de release. Esto es **obligatorio** porque el `GITHUB_TOKEN` integrado de GitHub no puede disparar otros workflows al crear PRs — lo que haría que los checks de CI esperen indefinidamente.

#### Paso 1: Crear una GitHub App

1. Ve a la configuración de tu **repositorio** u **organización**:
   - Repositorio: `Settings → Developer settings → GitHub Apps → New GitHub App`
   - Organización: `Settings → Developer settings → GitHub Apps → New GitHub App`
2. Completa los datos de la app:
   - **GitHub App name**: Cualquier nombre (ej. `ci-bot` o `release-bot`)
   - **Homepage URL**: La URL de tu repositorio
   - **Callback URL**: `https://localhost` (no se usa, pero es obligatorio)
3. **Permissions** (Permisos):
   - **Repository permissions**:
     - **Contents**: Read & write
     - **Pull requests**: Read & write
     - **Metadata**: Read-only
4. **Events**: No se necesitan eventos (deselecciona todos)
5. **Permissions & events**: Guardar
6. **Webhook**: Desactivar webhook (deseleccionar "Active")
7. Haz clic en **Create GitHub App**
8. Inmediatamente ve a **Private keys** y haz clic en **Generate a private key**
   - Descarga el archivo `.pem` — necesitarás su contenido

#### Paso 2: Agregar la App a tu Repositorio

1. Ve a `Settings → Install apps` de tu repositorio
2. Busca la app que acabas de crear y haz clic en **Install app**
3. Selecciona **All repositories** o **Only select repositories** y elige tu repo

#### Paso 3: Obtener el App ID

1. Vuelve a la página de configuración de tu GitHub App
2. Copia el **App ID** (un número, ej. `123456`)

#### Paso 4: Agregar los Secrets al Repositorio

1. Ve a `Settings → Secrets and variables → Actions` de tu repositorio
2. Agrega dos secrets:

| Nombre del Secret | Valor |
|---|---|
| `APP_ID` | El número de App ID del paso 3 |
| `APP_PRIVATE_KEY` | El **contenido completo** del archivo `.pem` (incluyendo `-----BEGIN RSA PRIVATE KEY-----` y `-----END RSA PRIVATE KEY-----`) |

> **Consejo:** Si usas la misma GitHub App en múltiples repositorios de una organización, agrega los secrets a **nivel de organización**:
> `Organization settings → Settings → Actions → Secrets and variables → Actions`

### 2. Publicación en crates.io (Opcional)

Si deseas publicar en crates.io:

| Nombre del Secret | Valor |
|---|---|
| `CARGO_REGISTRY_TOKEN` | Tu token API de crates.io desde [crates.io/me](https://crates.io/me) |

### 3. Publicación en npm (Opcional)

Si deseas publicar los paquetes wrapper de npm:

| Nombre del Secret | Valor |
|---|---|
| `NPM_TOKEN` | Tu token de acceso de npm desde [npm Settings → Tokens](https://www.npmjs.com/settings/org/{{NPM_SCOPE}}/tokens) |

### 4. Publicación en Docker Hub (Opcional)

Si deseas enviar imágenes Docker a Docker Hub:

| Nombre del Secret | Valor |
|---|---|
| `DOCKERHUB_USERNAME` | Tu usuario de Docker Hub |
| `DOCKERHUB_TOKEN` | Un token de acceso desde [Docker Hub → Settings → Security](https://hub.docker.com/settings/security) |

## Cómo Funciona

El workflow de release usa `actions/create-github-app-token` para generar un token de corta vida a partir de las credenciales de la GitHub App. Este token se pasa a:

- **`actions/checkout`** — para que el paso de checkout pueda hacer push de commits y crear PRs
- **`release-please-action`** — para que release-please pueda crear el PR de release y fusionarlo

Como el token pertenece a una GitHub App (no al `GITHUB_TOKEN` integrado), los PRs que crea **sí disparan otros workflows** (como el workflow de CI), permitiendo que los status checks pasen normalmente.

## Solución de Problemas

### "Permissions denied" al crear el PR de release

- Verifica que la GitHub App esté instalada en el repositorio
- Verifica que la App tenga permisos **Contents: Read & write** y **Pull requests: Read & write**
- Verifica que los secrets `APP_ID` y `APP_PRIVATE_KEY` estén configurados correctamente

### Los checks del PR de release siguen esperando

- Asegúrate de usar el token de la GitHub App, no `GITHUB_TOKEN`
- Verifica que el workflow de CI no esté deshabilitado: `Settings → Actions → General → Actions permissions`

### Error "Unable to access private key"

- El secret `APP_PRIVATE_KEY` debe contener el **contenido completo** del archivo `.pem`, incluyendo las líneas `-----BEGIN...` y `-----END...`
- No agregues espacios en blanco ni saltos de línea adicionales al pegar el secret

## Usar Esta Template en tu Propio Proyecto

Cuando crees un nuevo proyecto a partir de esta template:

1. **Si ya tienes una GitHub App** (por ejemplo, compartida entre los repos de tu organización), solo agrega los mismos secrets `APP_ID` y `APP_PRIVATE_KEY` al nuevo repositorio.

2. **Si no tienes una GitHub App**, sigue los pasos anteriores para crear una. Para uso a nivel de organización, crea la app a nivel de organización y agrega los secrets a nivel de organización.

3. **Los secrets opcionales** (`CARGO_REGISTRY_TOKEN`, `NPM_TOKEN`, secrets de Docker Hub) solo son necesarios si deseas publicar en esas plataformas. El workflow de release omitirá esos jobs si los secrets no están presentes.
