const sinon = require('sinon');
const { expect } = require('chai');

const productsModel = require('../../../models/productsModel');
const connection = require('../../../helpers/connection');
const dataMock = require('../../../__tests__/_dataMock');

describe('Model - Testes da rota "GET /products"', () => {
  describe('quando realiza a leitura de todos os produtos com sucesso', () => {
    before(() => {
      sinon.stub(connection, 'execute').resolves([dataMock.allProductsResponse]);
    });

    after(() => {
      connection.execute.restore();
    });

    describe('quando realiza leitura com sucesso', () => {

      it('retorna um array com todos os produtos', async () => {
        const products = await productsModel.getAll();
  
        expect(products).to.be.equals(dataMock.allProductsResponse);
      });
    });
  });
});

describe('Model - Testes da rota "GET /products/:id"', () => {
  const id = 1;

  describe('quando realiza a leitura do produto', () => {

    describe('quando encontra o produto', () => {

      beforeEach(() => {
      sinon.stub(connection, 'execute').resolves([[dataMock.allProductsResponse[0]]]);
      });

      afterEach(() => {
        connection.execute.restore();
      });
      
      it('retorna um objeto com os dados do produto', async () => {
        const product = await productsModel.getById(id)

        expect(product).to.be.equals(dataMock.allProductsResponse[0]);
      });
    });

    describe('quando não encontra o produto', () => {

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

describe('Model - Testes da rota "POST /products"', () => {
  describe('quando realiza a inserção do produto', () => {
    beforeEach(() => {
      sinon.stub(connection, 'execute').resolves([{ insertId: 4 }]);
    });
    afterEach(() => {
      connection.execute.restore();
    })

    it('retorna um objeto com os dados do produto', async () => {
      const product = await productsModel.addProduct(dataMock.rightProductBody.name);

      expect(product).to.be.eqls(dataMock.productCreateResponse);
    })
  })
});