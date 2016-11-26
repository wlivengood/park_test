const server = require('http').createServer(require('./app'));

server.listen(3000, console.log('listening on port 3000'));