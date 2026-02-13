# Teste Técnico — API de Usuários (Node.js / NestJS)

API desenvolvida para o teste técnico de **Desenvolvedor Node.js**, contemplando:

- Cadastro de usuário
- Login / autenticação
- Consulta de usuários
- Validação de documento:
  - CPF para brasileiros
  - Documento estrangeiro para não brasileiros

A autenticação foi implementada utilizando **JWT Bearer Token**.

---

## ✅ Tecnologias utilizadas

- Node.js
- NestJS
- Prisma ORM
- PostgreSQL
- class-validator
- bcryptjs
- JWT

---

## 🌐 Demo online (Railway) — sem instalar nada

A API está disponível online.  
Você pode testar diretamente sem rodar o projeto localmente.

**Base URL produção:**

```
https://testemobiis-production.up.railway.app
```

> Pode ocorrer um pequeno atraso na primeira requisição pois o plano gratuito pode "acordar" o serviço.

---

## 🧭 Base URLs

### Local

```
http://localhost:3000
```

### Railway

```
https://testemobiis-production.up.railway.app
```

---

## 🔐 Autenticação

Para rotas protegidas, envie:

```
Authorization: Bearer <token>
```

Os endpoints `/auth/sign-up` e `/auth/sign-in` são públicos.

---

## 👤 Cadastro de usuário

### POST `/auth/sign-up`

Cria usuário e retorna um token.

### Body

```json
{
  "name": "Lucas Albuquerque",
  "email": "lucas@email.com",
  "password": "senhaSuper123",
  "nationality": "BR",
  "document": "123.456.789-09"
}
```

### Regras

#### Brasileiro (`BR`)

- Documento deve ser um **CPF válido**
- Pode conter máscara
- Será salvo apenas com números

#### Estrangeiro (`FOREIGN`)

- 6 a 20 caracteres
- Apenas letras maiúsculas, números e hífen
- Normalizado para UPPERCASE

### Resposta

```json
{
  "accessToken": "jwt..."
}
```

---

## 🔑 Login

### POST `/auth/sign-in`

```json
{
  "email": "lucas@email.com",
  "password": "senhaSuper123"
}
```

Resposta:

```json
{
  "accessToken": "jwt..."
}
```

---

## 🙋 Usuário logado

### GET `/users/me` 🔒

Header:

```
Authorization: Bearer <token>
```

Resposta:

```json
{
  "id": "uuid",
  "name": "Lucas Albuquerque",
  "email": "lucas@email.com",
  "document": "12345678909",
  "nationality": "BR"
}
```

---

## 📋 Listagem de usuários

### GET `/users` 🔒

### Query params opcionais

| parâmetro   | descrição                         |
| ----------- | --------------------------------- |
| nationality | BR ou FOREIGN                     |
| document    | documento exato                   |
| page        | página (default 1)                |
| limit       | registros por página (default 10) |

Exemplo:

```
/users?nationality=BR&page=1&limit=10
```

Resposta:

```json
{
  "data": [],
  "totalCount": 0
}
```

---

# 🧪 Como testar no Insomnia (ou Postman)

## 🔹 Opção 1 — Usando Railway (mais fácil)

Crie um Environment:

```json
{
  "baseUrl": "https://testemobiis-production.up.railway.app",
  "token": ""
}
```

### 1) Fazer cadastro ou login

```
POST {{ _.baseUrl }}/auth/sign-in
```

Copie o token retornado.

### 2) Salve no environment:

```
token = SEU_TOKEN
```

### 3) Chamadas protegidas

```
GET {{ _.baseUrl }}/users/me
GET {{ _.baseUrl }}/users
```

Auth → Bearer → `{{ _.token }}`

---

## 🔹 Opção 2 — Rodando localmente

Use:

```json
{
  "baseUrl": "http://localhost:3000",
  "token": ""
}
```

---

## 🧾 Exemplos cURL (Railway)

### Login

```bash
curl -X POST "https://testemobiis-production.up.railway.app/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d '{"email":"lucas@email.com","password":"senhaSuper123"}'
```

### Usuário logado

```bash
curl -X GET "https://testemobiis-production.up.railway.app/users/me" \
  -H "Authorization: Bearer TOKEN"
```

---

# 🚀 Rodando localmente

## 1) Instalar dependências

```bash
npm install
```

## 2) Criar `.env`

```env
DATABASE_URL="postgresql://root:root@localhost:5432/mobiis?schema=public"
JWT_SECRET=segredo
```

---

## 3) Banco com Docker (opcional)

```bash
docker run --name mobiis-postgres \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=root \
  -e POSTGRES_DB=mobiis \
  -p 5432:5432 -d postgres:16
```

---

## 4) Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

---

## 5) Subir API

```bash
npm run start:dev
```

---

## 📌 Observações técnicas

- Senhas com hash bcrypt
- Email e documento possuem constraint de unicidade
- CPF salvo apenas com números
- Documento estrangeiro salvo em uppercase

---

## 👨‍💻 Autor

João Vitor Parussolo de Albuquerque
