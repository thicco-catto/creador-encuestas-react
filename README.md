# Creador de encuestas

Esta aplicación permite crear y editar encuestas. Estas encuestas cuentan con diversos perfiles de usuario, y las preguntas pueden adaptarse a ellos.

## Guia de Instalacion

1. Instalar Node.js y npm.
2. Descargar el código del proyecto.
3. Ejecutar el comando `npm i` para instalar todas las dependencias.
4. Crear un archivo `.env` para las variables de entorno.
5. Ejecutar el comando `npm run start` para ejecutar la aplicación en el entorno de desarrollo. Por defecto se ejecutará en el puerto 3000.

## Variables de Entorno

- **REACT_APP_BACKEND_URL:** Contiene la url a la api. Debe ser de la forma `https://[ruta]/api/`.
- **REACT_APP_API_KEY:** Contiene información usada por el servicio de autenticación de Firebase.
- **REACT_APP_AUTH_DOMAIN:** Contiene información usada por el servicio de autenticación de Firebase.
- **REACT_APP_PROJECT_ID:** Contiene información usada por el servicio de autenticación de Firebase.
- **REACT_APP_STORAGE_BUCKET:** Contiene información usada por el servicio de autenticación de Firebase.
- **REACT_APP_MESSAGING_SENDER_ID:** Contiene información usada por el servicio de autenticación de Firebase.
- **REACT_APP_APP_ID:** Contiene información usada por el servicio de autenticación de Firebase.
- **REACT_APP_MEASUREMENT_ID:** Contiene información usada por el servicio de autenticación de Firebase.
