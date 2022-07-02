const sinon = require('sinon');
const { expect } = require('chai');

const productsService = require('../../../services/productsService');
const productsModel = require('../../../models/productsModel');
const dataMock = require('../../../__tests__/_dataMock');
const generateError = require('../../../helpers/generateError');

const {
  allProductsResponse,
  productCreateResponse,
  wrongProductBody,
  rightProductBody,
  wrongSizeProductBody,
  productUpdateBody,
  productSearchNameResponse,
} = dataMock;

describe('Service - Testes da rota "GET /products"', () => {
  describe('quando realiza a leitura de todos os produtos com sucesso', () => {
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

describe('Service - Testes da rota "GET /products/:id"', () => {

  describe('quando realiza a leitura do produto', () => {

    describe('quando encontra o produto', () => {
      const id = 1;

      beforeEach(() => {
        sinon.stub(productsModel, 'getById').resolves(allProductsResponse[0]);
      });

      afterEach(() => {
        productsModel.getById.restore();
      });

      it('retorna um objeto com os dados do produto', async () => {
        const product = await productsService.getById(id);
  
        expect(product).to.be.equals(allProductsResponse[0]);
      });
    });

    describe('quando não encontra o produto', () => {
      const id = 9999;

      const erro = generateError('notFound', 'Product not found');

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
      const erro = generateError('badRequest','"name" is required');

      it('retorna um error object adequado', async () => {
        const product = await productsService.addProduct(wrongProductBody.name);

        expect(product).to.be.eqls(erro);
      });
    });

    describe('quando o "name" possui comprimento não permitido', () => {
      const erro = generateError('unprocessableEntity', '"name" length must be at least 5 characters long');

      it('retorna um error object adequado', async () => {
        const product = await productsService.addProduct(wrongSizeProductBody.name);

        expect(product).to.be.eqls(erro);
      });
    });
  });

  describe('quando o "name" é válido', () => {
    describe('quando realiza a inserção do produto', () => {
      beforeEach(() => {
        sinon.stub(productsModel, 'addProduct').resolves(productCreateResponse);
      });

      afterEach(() => {
        productsModel.addProduct.restore();
      });
  
      it('retorna um objeto com os dados do produto', async () => {
        const product = await productsService.addProduct(rightProductBody.name);
  
        expect(product).to.be.eqls(productCreateResponse);
      });
    });
  });
});

describe('Service - Testes da rota "PUT /products/:id"', () => {
  const { id, name } = allProductsResponse[0];

  describe('quando o "name" é inválido', () => {

    describe('quando o "name" não existe', () => {
      const erro = generateError('badRequest', '"name" is required');

      it('deve retornar o error object "{ error: { code: "badRequest", message: ""name" is required" } }"', async () => {
        const product = await productsService.updateProduct(id, null);

        expect(product).to.be.eqls(erro);
      });
    });

    describe('quando o "name" possui comprimento não permitido', () => {
      const erro = generateError('unprocessableEntity', '"name" length must be at least 5 characters long');

      it('deve retornar o error object "{ error: { code: "unprocessableEntity", message: ""name" length must be at least 5 characters long" } }"', async () => {
        const product = await productsService.updateProduct(id, wrongSizeProductBody.name);

        expect(product).to.be.eqls(erro);
      });
    });
  });

  describe('quando o produto não existe no banco de dados', () => {
    const erro = generateError('notFound', 'Product not found');

    beforeEach(() => {
      sinon.stub(productsModel, 'getById').resolves(undefined);
    });

    afterEach(() => {
      productsModel.getById.restore();
    });

    it('retorna o error object "{ error: code: "notFound", message: "Product not found" }"', async () => {
      const product = await productsService.updateProduct(9999, productUpdateBody.name);

      expect(product).to.be.eqls(erro);
    });
  })

  describe('quando atualiza um product', () => {

    beforeEach(() => {
      sinon.stub(productsModel, 'getById').resolves(allProductsResponse[0]);
      sinon.stub(productsModel, 'updateProduct').resolves();
    });

    afterEach(() => {
      productsModel.getById.restore();
      productsModel.updateProduct.restore();
    });

    it('retorna um objeto contendo informações do produto alterado', async () => {
      const product = await productsService.updateProduct(id, productUpdateBody.name);

      expect(product).to.be.eqls({ id, name: productUpdateBody.name });
    });
  });
});

describe('Service - Testes da rota "DELETE /products/:id"', () => {
  const { id } = allProductsResponse[0];

  describe('quando o produto não existe', () => {
    const erro = generateError('notFound', 'Product not found');

    beforeEach(() => {
      sinon.stub(productsModel, 'deleteProducts').resolves(0);
    });

    afterEach(() => {
      productsModel.deleteProducts.restore();
    });

    it('retorna o error object "{ error: { code: "notFound", message: "Product not found" } }"', async () => {
      const product = await productsService.deleteProducts(id);

      expect(product).to.be.eqls(erro);
    })
  });

  describe('quando o produto existe', () => {

    beforeEach(() => {
      sinon.stub(productsModel, 'deleteProducts').resolves(1);
    });

    afterEach(() => {
      productsModel.deleteProducts.restore();
    });

    it('retorna um objeto vazio "{}"', async () => {
      const product = await productsService.deleteProducts(id);

      expect(product).to.be.eqls({});
    });
  });
});

describe('Service - Testes da rota "GET /products/search?q="', () => {
  
  describe('quando o valor da query "q" não existe', () => {

    beforeEach(() => {
      sinon.stub(productsModel, 'getAll').resolves(allProductsResponse);
    });

    afterEach(() => {
      productsModel.getAll.restore();
    });

    it('retorna um array de objetos com todos os "products"', async () => {
      const q = null;

      const product = await productsService.searchProduct(q);

      expect(product).to.be.eqls(allProductsResponse);
    });
  });

  describe('quando o valor da query "q" existe', () => {
    
    describe('quando não encontra o "product"', () => {
      const erro = generateError('notFound', 'Product not found');

      beforeEach(() => {
        sinon.stub(productsModel, 'searchProduct').resolves([]);
      });

      afterEach(() => {
        productsModel.searchProduct.restore();
      });

      it('retorna o error object "{ error: { code: "notFound", message: "Product not found" } }"', async () => {
        const q = 'non-existing product';

        const product = await productsService.searchProduct(q);

        expect(product).to.be.eqls(erro);
      });
    });

    describe('quando encontra o "product"', () => {
  
      beforeEach(() => {
        sinon.stub(productsModel, 'searchProduct').resolves(productSearchNameResponse);
      });

      afterEach(() => {
        productsModel.searchProduct.restore();
      });

      it('retorna um array com o objeto do "product"', async () => {
        const q = productSearchNameResponse[0].name;

        const product = await productsService.searchProduct(q);

        expect(product).to.be.eqls(productSearchNameResponse);
      });
    });
  });
});