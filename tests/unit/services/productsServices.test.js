const sinon = require('sinon');
const { expect } = require('chai');

const productsService = require('../../../services/productsService');
const productsModel = require('../../../models/productsModel');
const { allProductsResponse } = require('../../../__tests__/_dataMock');

describe('Service - Testes da rota "/products"', () => {
  describe('quando realiza a leitura de todos os filmes com sucesso', () => {
    before(() => {
      sinon.stub(productsModel, 'getAll').resolves(allProductsResponse);
    });

    after(() => {
      productsModel.getAll.restore();
    });

    describe('quando realiza leitura com sucesso', () => {

      it('retorna um array com todos os produtos', async () => {
        const products = await productsService.getAll();
  
        expect(products).to.be.equals(allProductsResponse);
      });
    });
  });
});

describe('Service - Testes da rota "/products/:id"', () => {

  describe('quando realiza a leitura do filme', () => {

    describe('quando encontra o filme', () => {
      const id = 1;

      beforeEach(() => {
        sinon.stub(productsModel, 'getById').resolves(allProductsResponse[0]);
      });

      afterEach(() => {
        productsModel.getById.restore();
      });

      it('retorna um objeto com os dados do filme', async () => {
        const product = await productsService.getById(id);
  
        expect(product).to.be.equals(allProductsResponse[0]);
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
        sinon.stub(productsModel, 'getById').resolves(undefined);
      });

      afterEach(() => {
        productsModel.getById.restore();
      });

      it('retorna um error object', async () => {
        const product = await productsService.getById(id);
  
        expect(product).to.be.eqls(erro);
      });
    });
  });
});