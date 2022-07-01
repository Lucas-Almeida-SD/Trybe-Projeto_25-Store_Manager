const sinon = require('sinon');
const { expect } = require('chai');

const productsController = require('../../../controllers/productsController');;
const productsService = require('../../../services/productsService');
const dataMock = require('../../../__tests__/_dataMock');
const generateError = require('../../../helpers/generateError');

const {
  allProductsResponse,
  productCreateResponse,
  rightProductBody,
  wrongProductBody,
  wrongSizeProductBody,
  productUpdateBody,
} = dataMock;

describe('Controller - Testes da rota "/products"', () => {
  const request = {};
  const response = {};

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();
  });

  describe('quando realiza a leitura de todos os produtos com sucesso', () => {

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

      it('responde com um json contendo um array com os dados dos produtos', async () => {
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

  describe('quando realiza a leitura do produto', () => {

    describe('quando encontra o produto', () => {
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

      it('responde com um json contendo os dados do produto', async () => {
        await productsController.getById(request, response);
  
        expect(response.json.calledWith(allProductsResponse[0])).to.be.true;
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
        request.body = wrongProductBody;
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
        request.body = wrongSizeProductBody;
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
        request.body = rightProductBody;
        sinon.stub(productsService, 'addProduct').resolves(productCreateResponse);
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
  
        expect(response.json.calledWith(productCreateResponse)).to.be.true;
      });
    });
  });
});

describe('Controller - Testes da rota "PUT /products/:id"', () => {
  const request = {};
  const response = {};
  let next;

  const { id } = allProductsResponse[0];

  before(() => {
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub().returns();
    next = sinon.stub().returns();
  })

  describe('quando o "name" é inválido', () => {
    request.params = id;

    describe('quando o "name" não existe', () => {

      const erro = generateError('badRequest', '"name" is required');

      it('deve retornar a função next contendo como parâmetro o error object "{ code: "badRequest", message: ""name" is required" }"', async () => {
        request.body = wrongProductBody;
        
        await productsController.updateProduct(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });

    describe('quando o "name" possui comprimento não permitido', () => {
      const erro = generateError('unprocessableEntity', '"name" length must be at least 5 characters long');

      it('deve retornar a função next contendo como parâmetro o error object "{ code: "unprocessableEntity", message: ""name" length must be at least 5 characters long" }"', async () => {
        request.body = wrongSizeProductBody;

        await productsController.updateProduct(request, response, next);

        expect(next.calledWith(erro.error)).to.be.true;
      });
    });
  });

  describe('quando o produto não existe no banco de dados', () => {
    const erro = generateError('notFound', 'Product not found');

    beforeEach(() => {
      sinon.stub(productsService, 'updateProduct').resolves(erro);
    });

    afterEach(() => {
      productsService.updateProduct.restore();
    });

    it('deve retornar a função next contendo como parâmetro o error object "{ code: "notFound", message: "Product not found" }"', async () => {
      request.params = { id: 9999 };
      request.body = productUpdateBody;

      await productsController.updateProduct(request, response, next);

      expect(next.calledWith(erro.error)).to.be.true;
    });
  })

  describe('quando atualiza um product', () => {
    request.params = { id: allProductsResponse[0].id };
    request.body = productUpdateBody;

    beforeEach(() => {
      sinon.stub(productsService, 'updateProduct').resolves({ id, name: productUpdateBody.name });
    });

    afterEach(() => {
      productsService.updateProduct.restore();
    });

    it('responde com status "200"', async () => {
      await productsController.updateProduct(request, response, next);

      expect(response.status.calledWith(200)).to.be.true;
    });

    it('responde com um json contendo um objeto com informações do produto atualizado', async () => {
      await productsController.updateProduct(request, response, next);

      expect(response.json.calledWith({ id, name: productUpdateBody.name })).to.be.true;
    });
  });
});

describe('Controller - Testes da rota "DELETE /products/:id"', () => {
  const request = {};
  const response = {};
  let next;

  const { id } = allProductsResponse[0];

  before(() => {
    response.status = sinon.stub().returns(response);
    response.end = sinon.stub().returns();
    next = sinon.stub().returns();
  });

  describe('quando o produto não existe', () => {
    const erro = generateError('notFound', 'Product not found');

    beforeEach(() => {
      sinon.stub(productsService, 'deleteProducts').resolves(erro);
    });

    afterEach(() => {
      productsService.deleteProducts.restore();
    });

    it('retorna a função next contendo como parâmetro o error object "{ code: "notFound", message: "Product not found" }"', async () => {
      request.params = { id: 9999 };

      await productsController.deleteProducts(request, response, next);

      expect(next.calledWith(erro.error)).to.be.true;
    });
  });

  describe('quando o produto existe', () => {

    beforeEach(() => {
      sinon.stub(productsService, 'deleteProducts').resolves({});
    });

    afterEach(() => {
      productsService.deleteProducts.restore();
    });

    it('responde status "204"', async () => {
      request.params = { id };

      await productsController.deleteProducts(request, response, next);

      expect(response.status.calledWith(204)).to.be.true;
    });
  });
});