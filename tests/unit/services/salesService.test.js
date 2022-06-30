const sinon = require('sinon');
const { expect } = require('chai');

const salesService = require('../../../services/salesService');
const salesModel = require('../../../models/salesModel');
const productsModel = require('../../../models/productsModel');
const dataMock = require('../../../__tests__/_dataMock');
const generateError = require('../../../helpers/generateError');

const {
  wrongSaleNotProductIdBody,
  wrongSaleNotQuantityBody,
  wrongZeroNegativeBody,
  wrongZeroQuantityBody,
  nonexistentProductIdBody,
  saleCreateResponse,
  rightSaleBody,
} = dataMock;

describe('Service - Testes da rota "POST /sales"', () => {

  describe('quando os produtos de venda não são válidos', () => {

    describe('quando o "productId" não existe', () => {
      const erro = generateError('badRequest', '"productId" is required');

      it('retorna o error object "{ error: { code: "badRequest", message: ""productId" is required" } }"', async () => {
        const salesProduct = await salesService.addSales(wrongSaleNotProductIdBody);

        expect(salesProduct).to.be.eqls(erro);
      });
    });

    describe('quando o "quantity" não existe', () => {
      const erro = generateError('badRequest', '"quantity" is required');

      it('retorna o error object "{ error: { code: "badRequest", message: ""quantity" is required" } }"', async () => {
        const salesProduct = await salesService.addSales(wrongSaleNotQuantityBody);

        expect(salesProduct).to.be.eqls(erro);
      });
    });

    describe('quando o "quantity" é menor ou igual "0"', () => {
      const erro = generateError('unprocessableEntity', '"quantity" must be greater than or equal to 1');

      it('menor que "0" - retorna o error object "{ error: { code: "unprocessableEntity", message: ""quantity" must be greater than or equal to 1" } }"', async () => {
        const salesProduct = await salesService.addSales(wrongZeroNegativeBody);

        expect(salesProduct).to.be.eqls(erro);
      });

      it('igual a "0" - retorna o error object "{ error: { code: "unprocessableEntity", message: ""quantity" must be greater than or equal to 1" } }"', async () => {
        const salesProduct = await salesService.addSales(wrongZeroQuantityBody);

        expect(salesProduct).to.be.eqls(erro);
      });
    });
  });

  describe('quando algum "productId" não existe no banco de dados', () => {
    const erro = generateError('notFound', 'Product not found');
    const undefinedArray = nonexistentProductIdBody.map(() => undefined);

    beforeEach(() => {
      sinon.stub(Promise, 'all').resolves(undefinedArray);
    });

    afterEach(() => {
      Promise.all.restore();
    });

    it('retorna o error object "{ error: { code: "notFound", message: "Product not found } }"', async () => {
      const salesProduct = await salesService.addSales(nonexistentProductIdBody);

      expect(salesProduct).to.be.eqls(erro);
    });
  })

  describe('quando realiza a inserção na tabela "sales" e "sales_products"', () => {

    beforeEach(() => {
      sinon.stub(Promise, 'all').resolves(rightSaleBody);
      sinon.stub(salesModel, 'addSales').resolves(saleCreateResponse.id);
      sinon.stub(salesModel, 'addSalesProducts').resolves();
    });

    afterEach(() => {
      Promise.all.restore();
      salesModel.addSales.restore();
      salesModel.addSalesProducts.restore();
    });

    it('retorna um objeto com os dados da venda', async () => {
      const salesProduct = await salesService.addSales(rightSaleBody);

      expect(salesProduct).to.be.eqls(saleCreateResponse);
    });
  });

});