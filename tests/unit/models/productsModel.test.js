const sinon = require('sinon');
const { expect } = require('chai');

const productsModel = require('../../../models/productsModel');
const connection = require('../../../helpers/connection');
const { allProductsResponse } = require('../../../__tests__/_dataMock');


describe('Model - Testes da rota "/products"', () => {
  describe('quando realiza a leitura de todos os filmes com sucesso', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves([allProductsResponse]);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('quando realiza leitura com sucesso', () => {

      it('retorna um array com todos os produtos', async () => {
        const products = await productsModel.getAll();
  
        expect(products).to.be.equals(allProductsResponse);
      });
    });
  });
});

describe('Model - Testes da rota "/products/:id"', () => {
  const id = 1;

  describe('quando realiza a leitura do filme', () => {

    describe('quando encontra o filme', () => {

      beforeEach(() => {
      sinon.stub(connection, 'execute').resolves([[allProductsResponse[0]]]);
      });

      afterEach(() => {
        connection.execute.restore();
      });
      
      it('retorna um objeto com os dados do filme', async () => {
        const product = await productsModel.getById(id)

        expect(product).to.be.equals(allProductsResponse[0]);
      });
    });

    describe('quando não encontra o filme', () => {

      beforeEach(() => {
      sinon.stub(connection, 'execute').resolves([[]]);
      });

      afterEach(() => {
        connection.execute.restore();
      });

      it('retorna "undefined"', async () => {
        const product = await productsModel.getById(id)

        expect(product).to.be.undefined;
      });
    })
  });
});