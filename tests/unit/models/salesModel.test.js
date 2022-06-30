const sinon = require('sinon');
const { execute, expect } = require('chai');

const salesModel = require('../../../models/salesModel');
const connection = require('../../../helpers/connection');
const dataMock = require('../../../__tests__/_dataMock');

const { saleCreateResponse, rightSaleBody } = dataMock;

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