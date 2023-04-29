/**
 * Exercise: Step-1
 * Description: TCP Echo Server
 */
const net = require('net');

const server = net.createServer((socket) => {
  console.log(`Client connected ${socket.remoteAddress}:${socket.remotePort}`);

  // Set the encoding of the incoming data
  socket.setEncoding('utf8');

  socket.on('data', (data) => {
    process.stdout.write(`[${new Date().toUTCString()}] - received ${JSON.stringify(data)} from ${socket.remoteAddress}:${socket.remotePort}\n`);
    process.stdout.write(`[${new Date().toUTCString()}] - send ${JSON.stringify(data)} to ${socket.remoteAddress}:${socket.remotePort}\n`);
    socket.write(data.toString());
  });

  // listen for the socket to close
  socket.on('close', () => {
    console.log(`Client ${socket.remoteAddress}:${socket.remotePort} disconnected`);
  });
});

server.listen(9000, () => {
  console.log(`listening on ${server.address().address}:${server.address().port}`);
});
