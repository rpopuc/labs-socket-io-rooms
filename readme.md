# Lab Socket.io Rooms

Aplicação de estudo de gerenciamento de salas de conexão WebSocket com Socket.io.

O projeto é dividido em backend (Node) e frontend (Vue).

A parte do frontend foi construída com auxílio do Vite, com Vue 3 + Tailwind.

A parte de backend foi desenvolvida em Node com uso do Socket.io.

A aplicação possui duas interfaces:
- Definição das credenciais de acesso (nome da sala, nome e identificação do usuário)
- Entrada na sala

A sala é definida pela URL e é criada no servidor assim que algum usuário tente se conectar a ela. Por exemplo:
```
http://localhost/room/my-room
```

Em que `my-room` é a identificação da sala.

## Execução

Backend:
```
docker-compose up -d back
docker-compose exec back yarn server
```

Frontend:
```
docker-compose up -d front
docker-compose exec front yarn dev
```

A aplicação ficará disponível em http://localhost:3000
