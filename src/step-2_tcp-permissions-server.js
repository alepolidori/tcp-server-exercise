/**
 * Exercise: Step-2
 * Description: TCP Permissions Server
 */
const net = require('net');

// Contains associations between videos and users (the owners)
// keys are the video identifiers
// values are the user identifiers
// e.g. { "1": "1", "2": "2" } that means { "video-1": "user-1", "video-2": "user-2" }
const createdVideos = {}

const server = net.createServer((socket) => {
  console.log(`Client connected ${socket.remoteAddress}:${socket.remotePort}`);

  // Set the encoding of the incoming data
  socket.setEncoding('utf8');

  socket.on('data', (data) => {
    process.stdout.write(`[${new Date().toUTCString()}] - received ${JSON.stringify(data)} from ${socket.remoteAddress}:${socket.remotePort}\n`);
    const operationsList = parseOperationsStr(data)
    operationsList.forEach(operation => {
      if (isEditOperation(operation)) {
        const userId = getUserId(operation)
        const videoId = getVideoId(operation)
        if (checkEditPermission(userId, videoId)) {
          console.log('send "allow" answer');
          socket.write('allow\n');
        } else {
          console.log('send "deny" answer');
          socket.write('deny\n');
        }
      } else if (isCreateOperation(operation)) {
        const userId = getUserId(operation)
        const videoId = getVideoId(operation)
        if (!isVideoAlreadyCreated(videoId)) {
          createVideo(videoId, userId)
        }
      } else {
        console.log(`unknown operation requested: ${getOperation(operation)}`);
      }
    })
  });

  // listen for the socket to close
  socket.on('close', () => {
    console.log(`Client ${socket.remoteAddress}:${socket.remotePort} disconnected`);
  });
});

server.listen(9001, () => {
  console.log(`listening on ${server.address().address}:${server.address().port}`);
});

function parseOperationsStr(str) {
  const operations = str.split(/\\n|\n/)
  operations.pop()
  return operations
}

function isEditOperation(str) {
  let operation = str.split(' ')
  operation.pop()
  operation.shift()
  operation = operation.join('')
  if (operation === 'triestoedit') {
    return true
  }
  return false
}

function isCreateOperation(str) {
  let operation = str.split(' ')
  operation.pop()
  operation.shift()
  operation = operation.join('')
  if (operation === 'creates') {
    return true
  }
  return false
}

function getOperation(str) {
  let operation = str.split(' ')
  operation.pop()
  operation.shift()
  return operation.join('')
}

function getUserId(str) {
  let userId = str.split(' ')[0]
  userId = userId.split('-')[1]
  return userId
}

function getVideoId(str) {
  let videoId = str.split(' ').pop()
  videoId = videoId.split('-')[1].split('\n')[0]
  return videoId
}

function checkEditPermission(userId, videoId) {
  if (createdVideos[videoId] === userId) {
    return true
  }
  return false
}

function isVideoAlreadyCreated(videoId) {
  return createdVideos[videoId] !== undefined
}

function createVideo(videoId, userId) {
  createdVideos[videoId] = userId
  console.log(`${userId} created video ${videoId}`);
}
