const express = require('express');
const swaggerUi = require('swagger-ui-express');
const productsRouter = require('./routers/productsRouter');
const salesRouter = require('./routers/salesRouter');
const errorMiddleware = require('./middlewares/errorMiddleware');
const swaggerFile = require('./swagger_output.json');

const app = express();
app.use(express.json());

app.use('/products', productsRouter);
app.use('/sales', salesRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(errorMiddleware);

module.exports = app;
