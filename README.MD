![Imersão Full Stack && Full Cycle](https://events-fullcycle.s3.amazonaws.com/events-fullcycle/static/site/img/grupo_4417.png)

Participe gratuitamente: https://imersao.fullcycle.com.br/

## Sobre o repositório
Esse repositório contém o código-fonte ministrado na aula Nest.js + Server-Sent Events: Construindo Aplicações em Tempo Real [https://www.youtube.com/watch?v=lclbv5EiTlk](https://www.youtube.com/watch?v=lclbv5EiTlk)

## Rodar a aplicação

---

### express-sse

Acesse a pasta `express-sse`:

```bash
cd express-sse
```

Instale as dependências:

```bash
npm install
```

Para rodar a aplicação rode o comando:

```bash
npm run start
```

Acesse em seu navegador através do caminho: `http://localhost:3000`

---

### nestjs

Acesse a pasta `nestjs`:

```bash
cd nestjs
```

Rode os containers com o comando:

```bash
docker compose up
```

Entre no container do `nest`:

```bash
docker compose exec app bash
```

Instale as dependências:

```bash
npm install
```

Rode o comando para o `prisma` criar realizar a `migrate`:

```bash
npx prisma migrate dev
```

Para rodar a aplicação rode o comando:

```bash
npm run start:dev
```

Existe um arquivo na raiz do projeto Nest.js, o `api.http` que você pode usar para testar a aplicação com o plugin do VSCode [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client). Quando enviar dados na requisição, o Nest.js consumirá a mensagem e mostrará no console.