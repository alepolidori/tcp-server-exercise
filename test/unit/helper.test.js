const assert = require('assert')
const {
  getTeamId,
  getUserId,
  getVideoId,
  getOperation,
  getDestUserId,
  isViewOperation,
  isShareOperation,
  getVideoIdToShare,
  isCreateOperation,
  isAssignmentOperation,
} = require('../../src/helper')

describe('helper functionalities', () => {

  describe('getOperation', () => {
    it('should return the name of the "create" operation', () => {
      const msg = 'user-xvqqvvt creates video-ywgtraw'
      const res = getOperation(msg)
      assert.equal(res, 'creates')
    })

    it('should return the name of the "is assigned" operation', () => {
      const msg = 'user-hfeezct is assigned to team-qzjnuaq'
      const res = getOperation(msg)
      assert.equal(res, 'isassignedto')
    })

    it('should return the name of the "tries to view" operation', () => {
      const msg = 'user-xvqqvvt tries to view video-dtpvauy'
      const res = getOperation(msg)
      assert.equal(res, 'triestoview')
    })

    it('should return the name of the "tries to edit" operation', () => {
      const msg = 'user-kmxxhfh tries to edit video-rginwdd'
      const res = getOperation(msg)
      assert.equal(res, 'triestoedit')
    })

    it('should return the name of the "shares" operation', () => {
      const msg = 'user-iwjkpnf shares video-xvyqvjg with user-hfeezct'
      const res = getOperation(msg)
      assert.equal(res, 'sharesvideo-xvyqvjgwith')
    })

    it('should return an empty string if the argument is an empty string', () => {
      const msg = ''
      const res = getOperation(msg)
      assert.equal(res, '')
    })

    it('should return an empty string if the argument is null', () => {
      const msg = null
      const res = getOperation(msg)
      assert.equal(res, '')
    })
  })

  describe('getUserId', () => {
    it('should return the identifier of the user', () => {
      const msg = 'user-xvqqvvt creates video-ywgtraw'
      const res = getUserId(msg)
      assert.equal(res, 'xvqqvvt')
    })
  })

  describe('getDestUserId', () => {
    it('should return the identifier of the destination user', () => {
      const msg = 'user-iwjkpnf shares video-xvyqvjg with user-hfeezct'
      const res = getDestUserId(msg)
      assert.equal(res, 'hfeezct')
    })
  })

  describe('getVideoIdToShare', () => {
    it('should return the identifier of the video to be shared', () => {
      const msg = 'user-iwjkpnf shares video-xvyqvjg with user-hfeezct'
      const res = getVideoIdToShare(msg)
      assert.equal(res, 'xvyqvjg')
    })
  })

  describe('getVideoId', () => {
    it('should return the identifier of the video', () => {
      const msg = 'user-xvqqvvt creates video-ywgtraw'
      const res = getVideoId(msg)
      assert.equal(res, 'ywgtraw')
    })
  })

  describe('getTeamId', () => {
    it('should return the identifier of the team', () => {
      const msg = 'user-hfeezct is assigned to team-qzjnuaq'
      const res = getTeamId(msg)
      assert.equal(res, 'qzjnuaq')
    })
  })

  describe('isCreateOperation', () => {
    it('should return false if the operation is not the "create"', () => {
      const msg = 'user-hfeezct is assigned to team-qzjnuaq'
      const res = isCreateOperation(msg)
      assert.equal(res, false)
    })

    it('should return true if the operation is the "create"', () => {
      const msg = 'user-xvqqvvt creates video-ywgtraw'
      const res = isCreateOperation(msg)
      assert.equal(res, true)
    })
  })

  describe('isAssignmentOperation', () => {
    it('should return false if the operation is not the "assignment"', () => {
      const msg = 'user-xvqqvvt creates video-ywgtraw'
      const res = isAssignmentOperation(msg)
      assert.equal(res, false)
    })

    it('should return true if the operation is the "assignment"', () => {
      const msg = 'user-hfeezct is assigned to team-qzjnuaq'
      const res = isAssignmentOperation(msg)
      assert.equal(res, true)
    })
  })

  describe('isViewOperation', () => {
    it('should return false if the operation is not the "view"', () => {
      const msg = 'user-xvqqvvt creates video-ywgtraw'
      const res = isViewOperation(msg)
      assert.equal(res, false)
    })

    it('should return true if the operation is the "view"', () => {
      const msg = 'user-xvqqvvt tries to view video-dtpvauy'
      const res = isViewOperation(msg)
      assert.equal(res, true)
    })
  })

  describe('isShareOperation', () => {
    it('should return false if the operation is not the "share"', () => {
      const msg = 'user-xvqqvvt creates video-ywgtraw'
      const res = isShareOperation(msg)
      assert.equal(res, false)
    })

    it('should return true if the operation is the "share"', () => {
      const msg = 'user-iwjkpnf shares video-xvyqvjg with user-hfeezct'
      const res = isShareOperation(msg)
      assert.equal(res, true)
    })
  })
})