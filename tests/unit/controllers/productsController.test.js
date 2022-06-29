const sinon = require('sinon');
const { expect } = require('chai');

const productsController = require('../../../controllers/productsController');;
const productsService = require('../../../services/productsService');
const { allProductsResponse } = require('../../../__tests__/_dataMock');


describe('Controller - Testes da rota "/products"', () => {
  const request = {};
  const response = {};

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();
  });

  describe('quando realiza a leitura de todos os filmes com sucesso', () => {

    before(() => {
      sinon.stub(productsService, 'getAll').resolves(allProductsResponse);
    });

    after(() => {
      productsService.getAll.restore();
    });

    describe('quando realiza leitura com sucesso', () => {

      it('responde com um status "200"', async () => {
        await productsController.getAll(request, response);
  
        expect(response.status.calledWith(200)).to.be.true;
      });

      it('responde com um json contendo um array com os dados dos filmes', async () => {
        await productsController.getAll(request, response);
  
        expect(response.json.calledWith(allProductsResponse)).to.be.true;
      });
    });
  });
});

describe('Controller - Testes da rota "/products/:id"', () => {
  const request = {};
  const response = {};
  let next;

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();
  })

  describe('quando realiza a leitura do filme', () => {

    describe('quando encontra o filme', () => {
      const id = 1;

      beforeEach(() => {
        request.params = { id };
        sinon.stub(productsService, 'getById').resolves(allProductsResponse[0]);
      });

      afterEach(() => {
        productsService.getById.restore();
      });

      it('responde com um status "200"', async () => {
        await productsController.getById(request, response);
  
        expect(response.status.calledWith(200)).to.be.true;
      });

      it('responde com um json contendo os dados do filme', async () => {
        await productsController.getById(request, response);
  
        expect(response.json.calledWith(allProductsResponse[0])).to.be.true;
      });
    });

    describe('quando não encontra o filme', () => {
      const id = 9999;

      const erro = {
        error: {
          code: 'notFound',
          message: 'Product not found',
        },
      };
      beforeEach(() => {
        request.params = { id };
        next = sinon.stub().returns();
        sinon.stub(productsService, 'getById').resolves(erro);
      });

      afterEach(() => {
        productsService.getById.restore();
      });

      it('executa a função next contendo um erro como parâmetro', async () => {
        const ret = await productsController.getById(request, response, next);
  
        expect(next.calledWith(erro.error)).to.be.true;
      });
    });
  });
});