const sinon = require('sinon');
const { execute, expect } = require('chai');

const salesModel = require('../../../models/salesModel');
const connection = require('../../../helpers/connection');
const dataMock = require('../../../__tests__/_dataMock');
const myDataMock = require('../mocks/dataMock');

const { saleCreateResponse, rightSaleBody } = dataMock;
const { salesList, idOneSaleList } = myDataMock;

describe('Model - Testes da rota "POST /sales"', () => {

  describe('quando realiza a inserção na tabela "sales"', () => {

    beforeEach(() => {
      sinon.stub(connection, 'execute')
        .resolves([{ insertId: saleCreateResponse.id }]);
    });

    afterEach(() => {
      connection.execute.restore();
    });

    it('retorna o id da "sale"', async () => {
      const saleId = await salesModel.addSales();

      expect(saleId).to.be.equal(saleCreateResponse.id);
    });
  });

  describe('quando realiza a inserção na tabela "sales_products"', () => {
    const saleId = saleCreateResponse.id;
    const salesProducts = rightSaleBody;

    beforeEach(() => {
      sinon.stub(Promise, 'all').resolves();
      sinon.stub(connection, 'execute').resolves();
    });

    afterEach(() => {
      Promise.all.restore();
      connection.execute.restore();
    })

    it('não retorna nada', async () => {
      const result = await salesModel.addSalesProducts(saleId, salesProducts);

      expect(result).to.be.undefined;
    });

  });

});

describe('Model - Testes da rota "GET /sales"', () => {

  describe('quando realiza leitura das vendas', () => {

    beforeEach(() => {
      sinon.stub(connection, 'execute').resolves([salesList]);
    });

    afterEach(() => {
      connection.execute.restore();
    });

    it('retorna um array de objetos com informações das vendas', async () => {
      const sales = await salesModel.getAll();

      expect(sales).to.be.eqls(salesList);
    });
  });
});

describe('Model - Testes da rota "GET /sales/:id"', () => {

  describe('quando realiza leitura da venda', () => {

    describe('quando nao encontra a venda', () => {
      const nonExistentId = 9999;
      
      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves([[]]);
      });

      afterEach(() => {
        connection.execute.restore();
      });

      it('retorna "undefined"', async () => {
        const sale = await salesModel.getById(nonExistentId);

        expect(sale).to.be.undefined;
      });
    });

    describe('quando encontra a venda', () => {
      const saleId = 1;

      beforeEach(() => {
        sinon.stub(connection, 'execute').resolves([idOneSaleList]);
      });
  
      afterEach(() => {
        connection.execute.restore();
      });
  
      it('retorna um array de objetos com informações da venda', async () => {
        const sale = await salesModel.getById(saleId);
  
        expect(sale).to.be.eqls(idOneSaleList);
      });
    })
  });
});