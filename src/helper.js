/**
 * Extracts the list of operations in the received string.
 * 
 * @param {string} str The string to be parsed
 * @returns {Array} The list of all operations
*/
function parseOperationsStr(str) {
  const operations = str.split(/\\n|\n/)
  operations.pop()
  return operations
}

/**
 * Check if the provided operation is an edit operation.
 * 
 * @param {string} str The operation to be checked
 * @returns {boolean} True if the operation is an edit operation
 */
function isEditOperation(str) {
  const operation = getOperation(str)
  if (operation === 'triestoedit') {
    return true
  }
  return false
}

/**
 * Extracts the name of the operation.
 * 
 * @param {string} str The string containing the operation name
 * @returns {string} The name of the operation without white spaces
 */
function getOperation(str) {
  if (!str) {
    return ''
  }
  let operation = str.split(' ')
  operation.pop()
  operation.shift()
  return operation.join('')
}

/**
 * Extracts the identifier of the user.
 * 
 * @param {string} str The string containing the user identifier
 * @returns {string} The identifier of the user.
 *                   e.g. if the user is "user-1" it returns "1"
 */
function getUserId(str) {
  let userId = str.split(' ')[0]
  userId = userId.split('-')[1]
  return userId
}

/**
 * Extracts the identifier of the video.
 * 
 * @param {string} str The string containing the video identifier
 * @returns {string} The identifier of the video.
 *                   e.g. if the video is "video-1" it returns "1"
 */
function getVideoId(str) {
  let videoId = str.split(' ').pop()
  videoId = videoId.split('-')[1].split('\n')[0]
  return videoId
}

/**
 * Extracts the identifier of the team.
 * 
 * @param {string} str The string containing the team identifier
 * @returns {string} The identifier of the team.
 *                   e.g. if the team is "team-1" it returns "1"
 */
function getTeamId(str) {
  return getVideoId(str)
}

/**
 * Check if the provided operation is a create operation.
 * 
 * @param {string} str The operation to be checked
 * @returns {boolean} True if the operation is a create operation
 */
function isCreateOperation(str) {
  const operation = getOperation(str)
  if (operation === 'creates') {
    return true
  }
  return false
}

/**
 * Check if the provided operation is an assignment operation.
 * 
 * @param {string} str The operation to be checked
 * @returns {boolean} True if the operation is an assignment operation
 */
function isAssignmentOperation(str) {
  const operation = getOperation(str)
  if (operation === 'isassignedto') {
    return true
  }
  return false
}

/**
 * Check if the provided operation is a view operation.
 * 
 * @param {string} str The operation to be checked
 * @returns {boolean} True if the operation is a view operation
 */
function isViewOperation(str) {
  const operation = getOperation(str)
  if (operation === 'triestoview') {
    return true
  }
  return false
}

/**
 * Check if the provided operation is a share operation.
 * 
 * @param {string} str The operation to be checked
 * @returns {boolean} True if the operation is a share operation
 */
function isShareOperation(str) {
  const operation = getOperation(str)
  if (operation.indexOf('shares') === 0) {
    return true
  }
  return false
}

/**
 * Extracts the identifier of the destination user.
 * 
 * @param {string} str The string containing the destination user identifier
 * @returns {string} The identifier of the destination user.
 *                   e.g. if the user is "user-1" it returns "1"
 */
function getDestUserId(str) {
  return getVideoId(str)
}

/**
 * Extracts the identifier of the video to share.
 * 
 * @param {string} str The string containing the identifier of the video to be shared
 * @returns {string} The identifier of the video to be shared.
 *                   e.g. if the video is "video-1" it returns "1"
 */
function getVideoIdToShare(str) {
  let id = str.split(' ')[2] // e.g. "video-1"
  id = id.split('-')[1] // e.g. "1"
  return id
}

module.exports = {
  isAssignmentOperation,
  parseOperationsStr,
  getVideoIdToShare,
  isCreateOperation,
  isShareOperation,
  isViewOperation,
  isEditOperation,
  getDestUserId,
  getOperation,
  getVideoId,
  getTeamId,
  getUserId,
}
