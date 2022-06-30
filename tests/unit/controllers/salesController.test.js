const sinon = require('sinon');
const { expect } = require('chai');

const salesController = require('../../../controllers/salesController');
const salesService = require('../../../services/salesService');
const dataMock = require('../../../__tests__/_dataMock');
const generateError = require('../../../helpers/generateError');

const {
  wrongSaleNotProductIdBody,
  wrongSaleNotQuantityBody,
  wrongZeroNegativeBody,
  wrongZeroQuantityBody,
  saleCreateResponse,
} = dataMock;

describe('Controller - Testes da rota "POST /sales"', () => {
  const request = {};
  const response = {};
  let next;

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('quando os produtos de venda não são válidos', () => {

    describe('quando o "productId" não existe', () => {
      const erro = generateError('badRequest', '"productId" is required');

      it('retorna a função next contendo como parâmetro o error object "{ code: "badRequest", message: ""productId" is required" }"', async () => {
        request.body = wrongSaleNotProductIdBody;

        await salesController.addSales(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });

    describe('quando o "quantity" não existe', () => {
      const erro = generateError('badRequest', '"quantity" is required');
      
      it('retorna a função next contendo como parâmetro o error object "{ error: { code: "badRequest", message: ""quantity" is required" } }"', async () => {
        request.body = wrongSaleNotQuantityBody;

        await salesController.addSales(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });

    describe('quando o "quantity" é menor ou igual "0"', () => {
      const erro = generateError('unprocessableEntity', '"quantity" must be greater than or equal to 1');

      it('menor que "0" - retorna a função next contendo como parâmetro o error object "{ error: { code: "unprocessableEntity", message: ""quantity" must be greater than or equal to 1" } }"', async () => {
        request.body = wrongZeroNegativeBody;

        await salesController.addSales(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });

      it('igual a "0" - retorna a função next contendo como parâmetro o error object "{ error: { code: "unprocessableEntity", message: ""quantity" must be greater than or equal to 1" } }"', async () => {
        request.body = wrongZeroQuantityBody;

        await salesController.addSales(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });
  });

  describe('quando algum "productId" não existe no banco de dados', () => {
    const erro = generateError('notFound', 'Product not found');

    beforeEach(() => {
      sinon.stub(salesService, 'addSales').resolves(erro);
    });

    afterEach(() => {
      salesService.addSales.restore();
    });

    it('retorna a função next contendo como parâmetro o error object "{ error: { code: "notFound", message: "Product not found } }"', async () => {
      await salesController.addSales(request, response, next);

      expect(next.calledWith(erro.error)).to.be.true;
    });
  });

  describe('quando realiza a inserção na tabela "sales" e "sales_products"', () => {

    beforeEach(() => {
      sinon.stub(salesService, 'addSales').resolves(saleCreateResponse);
    });

    afterEach(() => {
      salesService.addSales.restore();
    });

    it('responde com "status 201"', async () => {
      await salesController.addSales(request, response, next);

      expect(response.status.calledWith(201)).to.be.true;
    });

    it('responde com "json" contendo um objeto com os dados da venda', async () => {
      await salesController.addSales(request, response, next);

      expect(response.json.calledWith(saleCreateResponse)).to.be.true;
    });
  });
});