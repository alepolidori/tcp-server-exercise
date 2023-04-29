/**
 * Exercise: Step-4
 * Description: TCP Share Permissions Server. The view of a video
 *              is allowed only if it has been shared
 */
const net = require('net');

// Contains associations between videos and users (the owners)
// keys are the video identifiers
// values are the user identifiers
// e.g. { "1": "1", "2": "2" } that means { "video-1": "user-1", "video-2": "user-2" }
const createdVideos = {}

// Contains the associations between users and the related belonging teams
// keys are the user identifiers
// values are objects where keys are the team identifiers and values are empty string
// e.g. { "1": { "1": ""}, "2": { "1": "", "4": "" } } that means:
//      { "user-1": { "team-1": "" }, "user-2": { "team-1": "", "team-4": "" }
const userTeamMap = {}

// Contains the associations between videos and the related users able to see them
// keys are video identifiers
// values are objects where keys are user identifiers and the values are empty string
// e.g. { "1": { "1": ""}, "2": { "1": "", "4": "" } } that means:
//      { "video-1": { "user-1": "" }, "video-2": { "user-1": "", "user-4": "" }
const sharePermissions = {}

const server = net.createServer((socket) => {
  console.log(`Client connected ${socket.remoteAddress}:${socket.remotePort}`);

  // Set the encoding of the incoming data
  socket.setEncoding('utf8');

  socket.on('data', (data) => {
    process.stdout.write(`[${new Date().toUTCString()}] - received ${JSON.stringify(data)} from ${socket.remoteAddress}:${socket.remotePort}\n`);
    const operationsList = parseOperationsStr(data)
    console.log(operationsList);
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
      } else if (isShareOperation(operation)) {
        console.log('share operation');
        const sourceUserId = getUserId(operation)
        const videoIdToShare = getVideoIdToShare(operation)
        const destUserId = getDestUserId(operation) 
        if (checkSharePermission(sourceUserId, videoIdToShare)) {
          addSharePermission(videoIdToShare, destUserId)
          console.log('send "allow" answer');
          socket.write('allow\n');
        } else {
          console.log('send "deny" answer');
          socket.write('deny\n');
        }
      } else if (isViewOperation(operation)) {
        console.log('view operation');
        const userId = getUserId(operation)
        const videoId = getVideoId(operation)
        if (checkViewPermission(userId, videoId)) {
          console.log('send "allow" answer');
          socket.write('allow\n');
        } else {
          console.log('send "deny" answer');
          socket.write('deny\n');
        }
      } else if (isAssignmentOperation(operation)) {
        const userId = getUserId(operation)
        const teamId = getTeamId(operation)
        assignUserToTeam(userId, teamId)
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

server.listen(9003, () => {
  console.log(`listening on ${server.address().address}:${server.address().port}`);
});

function addSharePermission(videoIdToShare, destUserId) {
  if (!sharePermissions[videoIdToShare]) {
    sharePermissions[videoIdToShare] = {}
  }
  sharePermissions[videoIdToShare][destUserId] = ''
  console.log(`video-${videoIdToShare} shared with user-${destUserId}`);
}

function assignUserToTeam(userId, teamId) {
  if (!userTeamMap[userId]) {
    userTeamMap[userId] = {}
  }
  userTeamMap[userId][teamId] = ''
  console.log(`user-${userId} assigned to team-${teamId}`);
}

function parseOperationsStr(str) {
  const operations = str.split(/\\n|\n/)
  operations.pop()
  return operations
}

function isAssignmentOperation(str) {
  const operation = getOperation(str)
  if (operation === 'isassignedto') {
    return true
  }
  return false
}

function isViewOperation(str) {
  const operation = getOperation(str)
  if (operation === 'triestoview') {
    return true
  }
  return false
}

function isShareOperation(str) {
  const operation = getOperation(str)
  if (operation.indexOf('shares') === 0) {
    return true
  }
  return false
}

function isEditOperation(str) {
  const operation = getOperation(str)
  if (operation === 'triestoedit') {
    return true
  }
  return false
}

function isCreateOperation(str) {
  const operation = getOperation(str)
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

function getTeamId(str) {
  return getVideoId(str)
}

function getDestUserId(str) {
  return getVideoId(str)
}

function getVideoIdToShare(str) {
  let id = str.split(' ')[2] // e.g. "video-1"
  id = id.split('-')[1] // e.g. "1"
  return id
}

function checkSharePermission(userId, videoId) {
  return checkOwnerPermission(userId, videoId)
}

function checkEditPermission(userId, videoId) {
  return checkOwnerPermission(userId, videoId)
}

function checkOwnerPermission(userId, videoId) {
  if (createdVideos[videoId] === userId) {
    return true
  }
  return false
}

function checkViewPermission(userId, videoId) {
  if (checkViewTeamPermission(userId, videoId) ||
      checkViewSharePermission(userId, videoId)) {
    return true
  }
  return false
}

function checkViewTeamPermission(userId, videoId) {
  const userVideoOwner = createdVideos[videoId] // the owner of the video
  if (!userTeamMap[userVideoOwner] || // the owner of the video has no team
      !userTeamMap[userId]) { // the user viewing the video has no team
    return false
  }
  for (let team in userTeamMap[userId]) { // cycle each team of the viewer user
    if (userTeamMap[userVideoOwner][team] === '') {
      return true
    }
  }
  return false
}

function checkViewSharePermission(userId, videoId) {
  if (sharePermissions[videoId] && sharePermissions[videoId][userId] === '') {
    return true
  }
  return false
}

function isVideoAlreadyCreated(videoId) {
  return createdVideos[videoId] !== undefined
}

function createVideo(videoId, userId) {
  createdVideos[videoId] = userId
  console.log(`user-${userId} created video-${videoId}`)
}
