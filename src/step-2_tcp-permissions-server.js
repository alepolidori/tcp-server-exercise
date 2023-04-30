/**
 * Exercise: Step-2
 * Description: TCP Permissions Server
 */
const net = require('net');
const {
  parseOperationsStr,
  isCreateOperation,
  isEditOperation,
  getOperation,
  getVideoId,
  getUserId,
} = require('./helper')

/**
 * Contains the associations between videos and users (the owners)
 * The keys are the video identifiers
 * The values are the user identifiers
 * e.g. { "1": "1", "2": "2" } that means { "video-1": "user-1", "video-2": "user-2" }
 */
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

/**
 * Check if the user has the permission to edit the video. Only
 * the owner of the video can edit it.
 * 
 * @param {string} userId The user identifier
 * @param {string} videoId The video identifier
 * @returns {boolean} True if the user is allowed to edit the video
 */
function checkEditPermission(userId, videoId) {
  if (createdVideos[videoId] === userId) {
    return true
  }
  return false
}

/**
 * Check if the video has already been created.
 * 
 * @param {string} videoId The video identifier
 * @returns {boolean} True if the video has not been created
 */
function isVideoAlreadyCreated(videoId) {
  return createdVideos[videoId] !== undefined
}

/**
 * Store the video into the in-memory data storage.
 * 
 * @param {string} userId The user identifier
 * @param {string} videoId The video identifier
 */
function createVideo(videoId, userId) {
  createdVideos[videoId] = userId
  console.log(`${userId} created video ${videoId}`);
}

module.exports = server
