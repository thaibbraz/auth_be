# Technologies Used

1. NodeJS
2. Express
3. JWT
4. Redis
5. Jest

# Prerequisites

- Git
- Redis server
- NodeJS
- CLI

# Installation

[Install Redis on your machine](https://redis.io/docs/getting-started/installation/)

Clone the Repository

https://github.com/thainabbraz/auth_be

Into the project directory

<code>cd auth_be</code>

Install all dependencies

<code>npm install</code>

Create a .env file with a SECRET_KEY

<code>touch .env</code>

Run the following to generate the key

<code>node</code><br>
<code>crypto.randomBytes(64).toString('hex');</code>

Then simply start your app

<code>npm run start</code>
