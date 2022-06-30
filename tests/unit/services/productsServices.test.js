const sinon = require('sinon');
const { expect } = require('chai');

const productsService = require('../../../services/productsService');
const productsModel = require('../../../models/productsModel');
const dataMock = require('../../../__tests__/_dataMock');

describe('Service - Testes da rota "GET /products"', () => {
  describe('quando realiza a leitura de todos os produtos com sucesso', () => {
    before(() => {
      sinon.stub(productsModel, 'getAll').resolves(dataMock.allProductsResponse);
    });

    after(() => {
      productsModel.getAll.restore();
    });

    describe('quando realiza leitura com sucesso', () => {

      it('retorna um array com todos os produtos', async () => {
        const products = await productsService.getAll();
  
        expect(products).to.be.equals(dataMock.allProductsResponse);
      });
    });
  });
});

describe('Service - Testes da rota "GET /products/:id"', () => {

  describe('quando realiza a leitura do produto', () => {

    describe('quando encontra o produto', () => {
      const id = 1;

      beforeEach(() => {
        sinon.stub(productsModel, 'getById').resolves(dataMock.allProductsResponse[0]);
      });

      afterEach(() => {
        productsModel.getById.restore();
      });

      it('retorna um objeto com os dados do produto', async () => {
        const product = await productsService.getById(id);
  
        expect(product).to.be.equals(dataMock.allProductsResponse[0]);
      });
    });

    describe('quando não encontra o produto', () => {
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

describe('Service - Testes da rota "POST /products"', () => {
  describe('quando o "name" é inválido', () => {
    describe('quando o "name" não existe', () => {
      const erro = { error: { code: 'badRequest', message: '"name" is required' } };

      it('retorna um error object adequado', async () => {
        const product = await productsService.addProduct(dataMock.wrongProductBody.name);

        expect(product).to.be.eqls(erro);
      });
    });

    describe('quando o "name" possui comprimento não permitido', () => {
      const erro = {
        error: {
          code: 'unprocessableEntity',
          message: '"name" length must be at least 5 characters long',
        }
      };

      it('retorna um error object adequado', async () => {
        const product = await productsService.addProduct(dataMock.wrongSizeProductBody.name);

        expect(product).to.be.eqls(erro);
      });
    });
  });

  describe('quando o "name" é válido', () => {
    describe('quando realiza a inserção do produto', () => {
      beforeEach(() => {
        sinon.stub(productsModel, 'addProduct').resolves(dataMock.productCreateResponse);
      });

      afterEach(() => {
        productsModel.addProduct.restore();
      });
  
      it('retorna um objeto com os dados do produto', async () => {
        const product = await productsService.addProduct(dataMock.rightProductBody.name);
  
        expect(product).to.be.eqls(dataMock.productCreateResponse);
      });
    });
  });
});