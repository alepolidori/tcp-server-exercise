/**
 * Exercise: Step-4
 * Description: TCP Share Permissions Server. The view of a video
 *              is allowed only if it has been shared
 */
const net = require('net');
const {
  isAssignmentOperation,
  parseOperationsStr,
  isCreateOperation,
  getVideoIdToShare,
  isShareOperation,
  isEditOperation,
  isViewOperation,
  getDestUserId,
  getOperation,
  getVideoId,
  getUserId,
  getTeamId,
} = require('./helper')

/**
 * Contains the associations between videos and users (the owners)
 * The keys are the video identifiers
 * The values are the user identifiers
 * e.g. { "1": "1", "2": "2" } that means { "video-1": "user-1", "video-2": "user-2" }
 */
const createdVideos = {}

/**
 * Contains the associations between users and the related belonging teams
 * The keys are the user identifiers
 * The values are objects where keys are the team identifiers and values are empty strings
 * e.g. { "1": { "1": ""}, "2": { "1": "", "4": "" } } that means:
 *      { "user-1": { "team-1": "" }, "user-2": { "team-1": "", "team-4": "" }
 */
const userTeamMap = {}

/**
 * Contains the share permissions: the associations between videos
 * and the related users able to see them.
 * The keys are the video identifiers
 * The values are objects where keys are user identifiers and the values are empty strings
 * e.g. { "1": { "1": ""}, "2": { "1": "", "4": "" } } that means:
 *      { "video-1": { "user-1": "" }, "video-2": { "user-1": "", "user-4": "" }
 */
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

/**
 * In-memory storage of the new sharing permission.
 * 
 * @param {string} videoIdToShare The identifier of the video to be shared
 * @param {string} destUserId The identifier of the user receiving the video shared
 */
function addSharePermission(videoIdToShare, destUserId) {
  if (!sharePermissions[videoIdToShare]) {
    sharePermissions[videoIdToShare] = {}
  }
  sharePermissions[videoIdToShare][destUserId] = ''
  console.log(`video-${videoIdToShare} shared with user-${destUserId}`);
}

/**
 * In-memory storage of the association between a user and a team.
 * 
 * @param {string} userId The user identifier
 * @param {string} teamId The team identifier
 */
function assignUserToTeam(userId, teamId) {
  if (!userTeamMap[userId]) {
    userTeamMap[userId] = {}
  }
  userTeamMap[userId][teamId] = ''
  console.log(`user-${userId} assigned to team-${teamId}`);
}

/**
 * Check if the user has the permission to share the video.
 * 
 * @param {string} userId The user identifier
 * @param {string} videoId The video identifier
 * @returns {boolean} True if the user is allowed to share the video
 */
function checkSharePermission(userId, videoId) {
  return checkOwnerPermission(userId, videoId)
}

/**
 * Check if the user has the permission to edit the video. Only
 * the owner of the video can edit it.
 * 
 * @param {string} userId The user identifier
 * @param {string} videoId The video identifier
 * @returns {boolean} True if the user is allowed to edit the video
 */
function checkEditPermission(userId, videoId) {
  return checkOwnerPermission(userId, videoId)
}

/**
 * Check if the user is the owner of the video.
 * 
 * @param {string} userId The user identifier
 * @param {string} videoId The video identifier
 * @returns {boolean} True if the user is the owner of the video
 */
function checkOwnerPermission(userId, videoId) {
  if (createdVideos[videoId] === userId) {
    return true
  }
  return false
}

/**
 * Check if the user has the permission to view the video.
 * 
 * @param {string} userId The user identifier
 * @param {string} videoId The video identifier
 * @returns {boolean} True if the user has the permission to view the video
 */
function checkViewPermission(userId, videoId) {
  if (checkViewTeamPermission(userId, videoId) ||
      checkViewSharePermission(userId, videoId)) {
    return true
  }
  return false
}

/**
 * Check if the user has the permission to view the video based
 * on the belonging to the same team of the video owner.
 * 
 * @param {string} userId The user identifier
 * @param {string} videoId The video identifier
 * @returns {boolean} True if the user belongs to one of the same team of
 *                    the owner of the video
 */
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

/**
 * Check if the user has the permission to view the video based
 * on the sharing permission.
 * 
 * @param {string} userId The user identifier
 * @param {string} videoId The video identifier
 * @returns {boolean} True if the video has been shared with the user
 */
function checkViewSharePermission(userId, videoId) {
  if (sharePermissions[videoId] && sharePermissions[videoId][userId] === '') {
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
  console.log(`user-${userId} created video-${videoId}`)
}
