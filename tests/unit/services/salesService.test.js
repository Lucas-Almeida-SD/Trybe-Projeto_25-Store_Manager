const sinon = require('sinon');
const { expect } = require('chai');

const salesService = require('../../../services/salesService');
const salesModel = require('../../../models/salesModel');
const productsModel = require('../../../models/productsModel');
const dataMock = require('../../../__tests__/_dataMock');
const generateError = require('../../../helpers/generateError');
const myDataMock = require('../mocks/dataMock');

const {
  allProductsResponse,
  wrongSaleNotProductIdBody,
  wrongSaleNotQuantityBody,
  wrongZeroNegativeBody,
  wrongZeroQuantityBody,
  nonexistentProductIdBody,
  saleCreateResponse,
  rightSaleBody,
} = dataMock;

const { salesList, idOneSaleList, allSalesResponse } = myDataMock;

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

describe('Service - Testes da rota "GET /sales"', () => {
  describe('quando realiza leitura das vendas', () => {

    beforeEach(() => {
      sinon.stub(salesModel, 'getAll').resolves(salesList);
    });

    afterEach(() => {
      salesModel.getAll.restore();
    });

    it('retorna um array de objetos com informações das vendas', async () => {
      const sales = await salesService.getAll();

      expect(sales).to.be.equals(salesList);
    });
  });
});

describe('Service - Testes da rota "GET /sales/:id"', () => {

  describe('quando realiza leitura da venda', () => {

    describe('quando nao encontra a venda', () => {
      const nonExistentId = 9999;
      const erro = generateError('notFound', 'Sale not found');

      beforeEach(() => {
        sinon.stub(salesModel, 'getById').resolves(undefined);
      });

      afterEach(() => {
        salesModel.getById.restore();
      });

      it('retorna o error object "{ error: { code: "notFound", message: "Sale not found" } }"', async () => {
        const sale = await salesService.getById(nonExistentId);

        expect(sale).to.be.eqls(erro);
      })
    });

    describe('quando encontra a venda', () => {
      const saleId = 1;

      beforeEach(() => {
        sinon.stub(salesModel, 'getById').resolves(idOneSaleList);
      });

      afterEach(() => {
        salesModel.getById.restore();
      });

      it('retorna um array de objetos com informações da venda', async () => {
        const sale = await salesService.getById(saleId);

        expect(sale).to.be.eqls(idOneSaleList);
      })
    });
  });
});

describe('Service - Testes da rota "DELETE /sales/:id"', () => {
  const saleId = 1;
  const nonExistentId = 9999;

  describe('quando a "sale" não existe', () => {
      const erro = generateError('notFound', 'Sale not found');

    beforeEach(() => {
      sinon.stub(salesModel, 'deleteSales').resolves(0);
      sinon.stub(salesModel, 'deleteSalesProducts').resolves();
    });

    afterEach(() => {
      salesModel.deleteSales.restore();
      salesModel.deleteSalesProducts.restore();
    });

    it('retorna o error object "{ error: { code: "notFound", message: "Sale not found" } }"', async () => {
      const sale = await salesService.deleteSales(nonExistentId);

      expect(sale).to.be.eqls(erro);
    });
  });

  describe('quando a "sale" é deletada', () => {

    beforeEach(() => {
      sinon.stub(salesModel, 'deleteSales').resolves(1);
      sinon.stub(salesModel, 'deleteSalesProducts').resolves();
    });

    afterEach(() => {
      salesModel.deleteSales.restore();
      salesModel.deleteSalesProducts.restore();
    });

    it('retorna um objeto vazio "{}"', async () => {
      const sale = await salesService.deleteSales(saleId);

      expect(sale).to.be.eqls({});
    });
  });
});

describe('Service - Testes da rota "PUT /sales/:id"', () => {
  const saleId = 1;
  const nonExistentSaleId = 9999;

  describe('quando "sales products" é inválido', () => {

    describe('quando algum "productId" não existe', () => {
      const erro = generateError('badRequest', '"productId" is required');

      it('retorna o error object "{ error: { code: "badRequest", message: ""productId" is required" } }"', async () => {
        const saleProduct = await salesService.updateSalesProducts(saleId, wrongSaleNotProductIdBody);

        expect(saleProduct).to.be.eqls(erro);
      });
    });

    describe('quando algum "quantity" não existe', () => {
      const erro = generateError('badRequest', '"quantity" is required');

      it('retorna o error object "{ error: { code: "badRequest", message: ""quantity" is required" } }"', async () => {
        const saleProduct = await salesService.updateSalesProducts(saleId, wrongSaleNotQuantityBody);

        expect(saleProduct).to.be.eqls(erro);
      });
    });

    describe('quando algum "quantity" é menor ou igual "0"', () => {
      const erro = generateError('unprocessableEntity', '"quantity" must be greater than or equal to 1');

      it('menor que "0" - retorna o error object "{ error: { code: "unprocessableEntity", message: ""quantity" must be greater than or equal to 1" } }"', async () => {
        const saleProduct = await salesService.updateSalesProducts(saleId, wrongZeroNegativeBody);

        expect(saleProduct).to.be.eqls(erro);
      });

      it('igual a "0" - retorna o error object "{ error: { code: "unprocessableEntity", message: ""quantity" must be greater than or equal to 1" } }"', async () => {
        const saleProduct = await salesService.updateSalesProducts(saleId, wrongZeroQuantityBody);

        expect(saleProduct).to.be.eqls(erro);
      });
    });
  });

  describe('quando "sale" não existe no banco de dados', () => {
    const erro = generateError('notFound', 'Sale not found');

    beforeEach(() => {
      sinon.stub(salesModel, 'getAll').resolves(allSalesResponse);
    });

    afterEach(() => {
      salesModel.getAll.restore();
    });

    it('retorna o error object "{ error: { code: "notFound", message: "Sale not found" } }', async () => {
      const saleProduct = await salesService.updateSalesProducts(nonExistentSaleId, rightSaleBody);

      expect(saleProduct).to.be.eqls(erro);
    });
  });

  describe('quando algum "product" não existe no banco de dados', () => {
    const erro = generateError('notFound', 'Product not found');

    beforeEach(() => {
      sinon.stub(salesModel, 'getAll').resolves(allSalesResponse);
      sinon.stub(productsModel, 'getAll').resolves(allProductsResponse)
    });

    afterEach(() => {
      salesModel.getAll.restore();
      productsModel.getAll.restore();
    });

    it('retorna o error object "{ error: { code: "notFound", message: "Product not found" } }', async () => {
      const saleProduct = await salesService.updateSalesProducts(saleId, nonexistentProductIdBody);

      expect(saleProduct).to.be.eqls(erro);
    });
  });

  describe('quando atualiza os "sales products"', () => {

    beforeEach(() => {
      sinon.stub(salesModel, 'getAll').resolves(allSalesResponse);
      sinon.stub(productsModel, 'getAll').resolves(allProductsResponse)
      sinon.stub(Promise, 'all').resolves();
    });

    afterEach(() => {
      salesModel.getAll.restore();
      productsModel.getAll.restore();
      Promise.all.restore();
    });

    it('retorna um objeto contendo os dados da alteração', async () => {
      const saleProduct = await salesService.updateSalesProducts(saleId, rightSaleBody);

      expect(saleProduct).to.be.eqls({ saleId, itemsUpdated: rightSaleBody });
    });
  });
});