import swaggerJSDoc from 'swagger-jsdoc';

// Opciones de configuración para Swagger
export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentación para la API',
    },
    servers: [
      {
        url: '/api/v1',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Rutas donde Swagger buscará los comentarios de la API
});
