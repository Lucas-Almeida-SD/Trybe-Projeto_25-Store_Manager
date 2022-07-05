const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routers/productsRouter.js', './routers/salesRouter.js'];

swaggerAutogen(outputFile, endpointsFiles);
