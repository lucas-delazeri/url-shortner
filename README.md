# Encurta

Encurta URLs longas e compartilha links curtos. O projeto usa HTML, CSS e
JavaScript no frontend, Node.js e Express na API, e MongoDB para armazenar os
links.

## Requisitos

- Node.js e npm
- Docker em execução

## Configuração

Na raiz do projeto, crie e inicie o contêiner MongoDB com armazenamento
persistente:

```bash
docker run -d \
  --name url-shortner-mongo \
  --restart unless-stopped \
  -p 4000:27017 \
  -v url-shortner-mongo-data:/data/db \
  mongo:8
```

Configure a URI do banco no arquivo `backend/.env`. Você pode copiar o arquivo
de exemplo:

```powershell
Copy-Item backend/.env.example backend/.env
```

Defina em `backend/.env`:

```env
MONGO_URL=mongodb://127.0.0.1:4000/url-shortner
```

Instale as dependências e inicie a API:

```powershell
cd backend
npm install
npm start
```

O script `prestart` inicia o contêiner `url-shortner-mongo`. É necessário
criá-lo antes com o comando `docker run` acima. A API fica disponível em
`http://localhost:3000`.

## Frontend

Com a API em execução, abra `frontend/index.html` no navegador. Informe uma URL
completa, incluindo `https://`, e pressione **Encurtar link**. O resultado
pode ser aberto ou copiado pelo botão **Copiar link**.

## Endpoints

### Encurtar uma URL

`POST /api/shorten`

Exemplo de corpo:

```json
{
  "originalUrl": "https://example.com/uma-pagina"
}
```

Retorna `201 Created` com a URL original e o código curto:

```json
{
  "originalUrl": "https://example.com/uma-pagina",
  "shortUrl": "CODIGO_CURTO"
}
```

### Redirecionar para a URL original

`GET /:shortUrl`

Por exemplo, `http://localhost:3000/CODIGO_CURTO` redireciona para a URL
original. Um código desconhecido retorna `404`; se o banco estiver
indisponível, a API retorna `503`.

## MongoDB

Para parar o banco sem apagar os dados:

```powershell
docker stop url-shortner-mongo
```

Para iniciá-lo novamente:

```powershell
docker start url-shortner-mongo
```

O arquivo `backend/.env` contém configuração local e não deve ser enviado ao
repositório.
