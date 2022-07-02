const sinon = require('sinon');
const { expect } = require('chai');

const salesController = require('../../../controllers/salesController');
const salesService = require('../../../services/salesService');
const dataMock = require('../../../__tests__/_dataMock');
const generateError = require('../../../helpers/generateError');
const myDataMock = require('../mocks/dataMock');

const {
  wrongSaleNotProductIdBody,
  wrongSaleNotQuantityBody,
  wrongZeroNegativeBody,
  wrongZeroQuantityBody,
  saleCreateResponse,
  rightSaleBody,
  nonexistentProductIdBody,
} = dataMock;

const { salesList, idOneSaleList } = myDataMock;

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
      
      it('retorna a função next contendo como parâmetro o error object "{ code: "badRequest", message: ""quantity" is required" }"', async () => {
        request.body = wrongSaleNotQuantityBody;

        await salesController.addSales(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });

    describe('quando o "quantity" é menor ou igual "0"', () => {
      const erro = generateError('unprocessableEntity', '"quantity" must be greater than or equal to 1');

      it('menor que "0" - retorna a função next contendo como parâmetro o error object "{ code: "unprocessableEntity", message: ""quantity" must be greater than or equal to 1" }"', async () => {
        request.body = wrongZeroNegativeBody;

        await salesController.addSales(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });

      it('igual a "0" - retorna a função next contendo como parâmetro o error object "{ code: "unprocessableEntity", message: ""quantity" must be greater than or equal to 1" }"', async () => {
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

    it('retorna a função next contendo como parâmetro o error object "{ code: "notFound", message: "Product not found" }"', async () => {
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

describe('Controller - Testes da rota "GET /sales"', () => {
  const request = {};
  const response = {};
  let next;

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();
  });

  describe('quando realiza leitura das vendas', () => {

    beforeEach(() => {
      sinon.stub(salesService, 'getAll').resolves(salesList);
    });

    afterEach(() => {
      salesService.getAll.restore();
    });

    it('responde com status "200"', async () => {
      await salesController.getAll(request, response);

      expect(response.status.calledWith(200)).to.be.true;
    });

    it('responde com json contendo um array de objetos com informações das vendas', async () => {
      await salesController.getAll(request, response);

      expect(response.json.calledWith(salesList)).to.be.true;
    });
  });
});

describe('Controller - Testes da rota "GET /sales/:id"', () => {
  const request = {};
  const response = {};
  let next;

  const saleId = 1;
  const nonExistentId = 9999;

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('quando realiza leitura da venda', () => {

    describe('quando não encotra a venda', () => {
      request.params = { id: nonExistentId };
      const erro = generateError('notFound', 'Sale not found');
  
      beforeEach(() => {
        sinon.stub(salesService, 'getById').resolves(erro);
      });
  
      afterEach(() => {
        salesService.getById.restore();
      });
  
      it('retorna a função next contendo como parâmetro o error object "{ code: "notFound", message: "Product not found" }"', async () => {
        await salesController.getById(request, response, next);
  
        expect(next.calledWith(erro.error)).to.be.true;
      });
    });
  
    describe('quando encontra a venda', () => {
      request.params = { id: saleId };
  
      beforeEach(() => {
        sinon.stub(salesService, 'getById').resolves(idOneSaleList);
      });
  
      afterEach(() => {
        salesService.getById.restore();
      });
  
      it('responde com status "200"', async () => {
        await salesController.getById(request, response, next);
  
        expect(response.status.calledWith(200)).to.be.true;
      });
  
      it('responde com json contendo um array de objetos com informações da venda', async () => {
        await salesController.getById(request, response, next);
  
        expect(response.json.calledWith(idOneSaleList)).to.be.true;
      });
    });
  });
});

describe('Controller - Testes da rota "DELETE /sales/:id"', () => {
  const request = {};
  const response = {};
  let next;

  const saleId = 1;
  const nonExistentId = 9999;

  before(() => {
    response.status = sinon.stub().returns(response);
    response.end = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('quando a "sale" não existe', () => {
      const erro = generateError('notFound', 'Sale not found');

    beforeEach(() => {
      sinon.stub(salesService, 'deleteSales').resolves(erro);
    });

    afterEach(() => {
      salesService.deleteSales.restore();
    });

    it('retorna a função next contendo como parâmetro o error object "{ code: "notFound", message: "Sale not found" }"', async () => {
      request.params = {};

      await salesController.deleteSales(request, response, next);

      expect(next.calledWith(erro.error)).to.be.true;
    });
  });

  describe('quando a "sale" é deletada', () => {

    beforeEach(() => {
      sinon.stub(salesService, 'deleteSales').resolves({});
    });

    afterEach(() => {
      salesService.deleteSales.restore();
    });

    it('responde com status "204"', async () => {
      request.params = { id: saleId };

      await salesController.deleteSales(request, response, next);

      expect(response.status.calledWith(204)).to.be.true;
    });
  });
});

describe('Controller - Testes da rota "PUT /sales/:id"', () => {
  const request = {};
  const response = {};
  let next;

  const saleId = 1;
  const nonExistentId = 9999;

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('quando "sales products" é inválido', () => {

    describe('quando algum "productId" não existe', () => {
      const erro = generateError('badRequest', '"productId" is required');

      beforeEach(() => {
        sinon.stub(salesService, 'updateSalesProducts').resolves(erro);
      });

      afterEach(() => {
        salesService.updateSalesProducts.restore();
      });

      it('retorna a função next contendo como parâmetro o error object "{ code: "badRequest", message: ""productId" is required" }"', async () => {
        request.params = saleId;
        response.body = wrongSaleNotProductIdBody;
          
        await salesController.updateSalesProducts(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });

    describe('quando algum "quantity" não existe', () => {
      const erro = generateError('badRequest', '"quantity" is required');

      beforeEach(() => {
        sinon.stub(salesService, 'updateSalesProducts').resolves(erro);
      });

      afterEach(() => {
        salesService.updateSalesProducts.restore();
      });

      it('retorna a função next contendo como parâmetro o error object "{ code: "badRequest", message: ""quantity" is required" }"', async () => {
        request.params = saleId;
        response.body = wrongSaleNotQuantityBody;
          
        await salesController.updateSalesProducts(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });

    describe('quando algum "quantity" é menor ou igual "0"', () => {
      const erro = generateError('unprocessableEntity', '"quantity" must be greater than or equal to 1');

      beforeEach(() => {
        sinon.stub(salesService, 'updateSalesProducts').resolves(erro);
      });

      afterEach(() => {
        salesService.updateSalesProducts.restore();
      });

      it('menor que "0" - retorna a função next contendo como parâmetro o error object "{ code: "unprocessableEntity", message: ""quantity" must be greater than or equal to 1" }"', async () => {
        request.params = saleId;
        response.body = wrongZeroNegativeBody;
          
        await salesController.updateSalesProducts(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });

      it('igual a "0" - retorna a função next contendo como parâmetro o error object "{ code: "unprocessableEntity", message: ""quantity" must be greater than or equal to 1" }"', async () => {
        request.params = saleId;
        response.body = wrongZeroQuantityBody;
          
        await salesController.updateSalesProducts(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });
  });

  describe('quando "sale" não existe no banco de dados', () => {
    const erro = generateError('notFound', 'Sale not found');

    beforeEach(() => {
      sinon.stub(salesService, 'updateSalesProducts').resolves(erro);
    });

    afterEach(() => {
      salesService.updateSalesProducts.restore();
    });

    it('retorna a função next contendo como parâmetro o error object "{ code: "notFound", message: "Sale not found" }', async () => {
      request.params = nonExistentId;
      response.body = rightSaleBody;
        
      await salesController.updateSalesProducts(request, response, next);

      expect(next.calledWith(erro.error)).to.be.true;
    });
  });

  describe('quando algum "product" não existe no banco de dados', () => {
    const erro = generateError('notFound', 'Product not found');

    beforeEach(() => {
      sinon.stub(salesService, 'updateSalesProducts').resolves(erro);
    });

    afterEach(() => {
      salesService.updateSalesProducts.restore();
    });

    it('retorna a função next contendo como parâmetro o error object "{ code: "notFound", message: "Product not found" }', async () => {
      request.params = saleId;
      response.body = nonexistentProductIdBody;
        
      await salesController.updateSalesProducts(request, response, next);

      expect(next.calledWith(erro.error)).to.be.true;
    });
  });

  describe('quando atualiza os "sales products"', () => {
    const updatedSalesProducts = { saleId, itemsUpdated: rightSaleBody }

    beforeEach(() => {
      request.params = saleId;
      response.body = rightSaleBody;

      sinon.stub(salesService, 'updateSalesProducts').resolves(updatedSalesProducts);
    });

    afterEach(() => {
      salesService.updateSalesProducts.restore();
    });

    it('responde com status "200"', async () => {
      await salesController.updateSalesProducts(request, response, next);

      expect(response.status.calledWith(200)).to.be.true;
    });


    it('responde com status "200"', async () => {
      await salesController.updateSalesProducts(request, response, next);

      expect(response.json.calledWith(updatedSalesProducts)).to.be.true;
    });
  });
});