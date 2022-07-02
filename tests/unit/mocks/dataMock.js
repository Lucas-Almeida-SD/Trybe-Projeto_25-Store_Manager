const salesList = [
  {
    "saleId": 1,
    "date": "2021-09-09T04:54:29.000Z",
    "productId": 1,
    "quantity": 2
  },
  {
    "saleId": 1,
    "date": "2021-09-09T04:54:54.000Z",
    "productId": 2,
    "quantity": 2
  },
  {
    "saleId": 2,
    "date": "2022-06-30T19:13:51.000Z",
    "productId": 3,
    "quantity": 15
  }
];

const idOneSaleList = [
  {
    "date": "2021-09-09T04:54:29.000Z",
    "productId": 1,
    "quantity": 2
  },
  {
    "date": "2021-09-09T04:54:54.000Z",
    "productId": 2,
    "quantity": 2
  }
];

const updatedProductResponse = {
  "id": 1,
  "name": "Martelo do Batman"
};

const allSalesResponse = [
  { saleId: 1, date: '2022-07-01 03:24:07', productId: 1, quantity: 5 },
  { saleId: 1, date: '2022-07-01 03:24:07', productId: 2, quantity: 10 },
  { saleId: 2, date: '2022-07-01 03:24:07', productId: 1, quantity: 8 },
];

module.exports = {
  salesList,
  idOneSaleList,
  updatedProductResponse,
  allSalesResponse,
};