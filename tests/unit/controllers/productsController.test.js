const sinon = require('sinon');
const { expect } = require('chai');

const productsController = require('../../../controllers/productsController');;
const productsService = require('../../../services/productsService');
const dataMock = require('../../../__tests__/_dataMock');

describe('Controller - Testes da rota "/products"', () => {
  const request = {};
  const response = {};

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();
  });

  describe('quando realiza a leitura de todos os produtos com sucesso', () => {

    before(() => {
      sinon.stub(productsService, 'getAll').resolves(dataMock.allProductsResponse);
    });

    after(() => {
      productsService.getAll.restore();
    });

    describe('quando realiza leitura com sucesso', () => {

      it('responde com um status "200"', async () => {
        await productsController.getAll(request, response);
  
        expect(response.status.calledWith(200)).to.be.true;
      });

      it('responde com um json contendo um array com os dados dos produtos', async () => {
        await productsController.getAll(request, response);
  
        expect(response.json.calledWith(dataMock.allProductsResponse)).to.be.true;
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

  describe('quando realiza a leitura do produto', () => {

    describe('quando encontra o produto', () => {
      const id = 1;

      beforeEach(() => {
        request.params = { id };
        sinon.stub(productsService, 'getById').resolves(dataMock.allProductsResponse[0]);
      });

      afterEach(() => {
        productsService.getById.restore();
      });

      it('responde com um status "200"', async () => {
        await productsController.getById(request, response);
  
        expect(response.status.calledWith(200)).to.be.true;
      });

      it('responde com um json contendo os dados do produto', async () => {
        await productsController.getById(request, response);
  
        expect(response.json.calledWith(dataMock.allProductsResponse[0])).to.be.true;
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
        request.params = { id };
        next = sinon.stub().returns();
        sinon.stub(productsService, 'getById').resolves(erro);
      });

      afterEach(() => {
        productsService.getById.restore();
      });

      it('retorna a função next contendo um erro como parâmetro', async () => {
        const ret = await productsController.getById(request, response, next);
  
        expect(next.calledWith(erro.error)).to.be.true;
      });
    });
  });
});

describe('Controller - Testes da rota "POST /products"', () => {
  const request = {};
  const response = {};
  let next;

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('quando o "name" é inválido', () => {
    describe('quando o "name" não existe', () => {
      const erro = { error: { code: 'badRequest', message: '"name" is required' } };

      beforeEach(() => {
        request.body = dataMock.wrongProductBody;
        sinon.stub(productsService, 'addProduct').resolves(erro);
      });

      afterEach(() => {
        productsService.addProduct.restore();
      })

      it('retorna a função next contendo um erro como parâmetro' , async () => {
        await productsController.addProduct(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });

    describe('quando o "name" possui comprimento não permitido', () => {
      const erro = {
        error: {
          code: 'unprocessableEntity',
          message: '"name" length must be at least 5 characters long',
        }
      };

      beforeEach(() => {
        request.body = dataMock.wrongSizeProductBody;
        sinon.stub(productsService, 'addProduct').resolves(erro);
      });

        afterEach(() => {
        productsService.addProduct.restore();
      })

      it('retorna a função next contendo um erro como parâmetro' , async () => {
        await productsController.addProduct(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });
  });

  describe('quando o "name" é válido', () => {
    describe('quando realiza a inserção do produto', () => {
      beforeEach(() => {
        request.body = dataMock.rightProductBody
        sinon.stub(productsService, 'addProduct').resolves(dataMock.productCreateResponse);
      });

      afterEach(() => {
        productsService.addProduct.restore();
      });
  
      it('responde com um status "201"', async () => {
        await productsController.addProduct(request, response);
  
        expect(response.status.calledWith(201)).to.be.true;
      });

      it('responde com um json contendo os dados do produto', async () => {
        await productsController.addProduct(request, response);
  
        expect(response.json.calledWith(dataMock.productCreateResponse)).to.be.true;
      });
    });
  });
});