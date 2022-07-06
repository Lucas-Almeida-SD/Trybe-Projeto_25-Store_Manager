# Projeto Store Manager

Esse projeto foi realizado para exercitar o que foi aprendido no Bloco 23 do Módulo de Back End do curso da [Trybe](https://www.betrybe.com/), no qual foi sobre a Arquitetura de Software `MSC - (Model-Service-Controller)`, testes das camadas do `MSC` e também sobre a Arquitetura `REST`.

Nesse projeto foi desenvolvida, através do `Node.js` e `Express`, uma `API RESTful` utilizando a arquitetura de software `MSC`.

A API é um sistema de gerenciamento de vendas no formato dropshipping em que é possível fazer um `CRUD (Create, Read, Update, Delete)`, ou seja, criar, visualizar, deletar e atualizar produtos e vendas.

Para a gestão de dados, foi utilizado o sistema MySQL.

Para verificar a funcionalidade da API foram desenvolvidos testes com as ferramentas `Mocha`, `Chai` e `Sinon`.

## Tecnologias

  - Node.js
  - Express
  - MySQL
  - Mocha, Chai e Sinon

## Como executar

Clone o projeto e acesse a pasta do mesmo.

```bash
$ git clone git@github.com:Lucas-Almeida-SD/Trybe-Projeto_25-Store_Manager.git
$ cd Trybe-Projeto_25-Store_Manager
```

Para iniciá-lo, siga os passos abaixo:

<details>
  <summary><strong>Com Docker</strong></summary>

  ```bash
  # Criar container
  $ docker-compose up -d

  # Abrir terminal interativo do container
  $ docker container exec -it store_manager bash

  # Instalar as dependências
  $ npm install

  # Criar o banco de dados
  $ npm run migration

  # Popular o banco de dados
  $ npm run seed

  # Iniciar o projeto
  $ npm start
  ```

  Para executar os testes, utilize o terminal interativo do container e insira o comando abaixo: 

  ```bash
  $ npm run test:mocha
  ```
</details>

<details>
  <summary><strong>Sem Docker</strong></summary>

  ```bash
  # Instalar as dependências
  $ npm install

  # Criar o banco de dados
  $ npm run migration

  # Popular o banco de dados
  $ npm run seed

  # Iniciar o projeto
  $ npm start
  ```

  Para executar os testes, utilize o terminal e insira o comando abaixo: 

  ```bash
  $ npm run test:mocha
  ```
</details>

Acesse a documentação da API no link [localhost:3000/docs](http://localhost:3000/docs).
