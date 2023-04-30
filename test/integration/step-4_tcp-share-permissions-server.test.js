const net = require('net')
const assert = require('assert')
const { server, resetData } = require('../../src/step-4_tcp-share-permissions-server')

describe('TCP Share Permissions Server', () => {
  const PORT = 9003
  const HOST = 'localhost'
  let client

  beforeEach(done => {
    client = net.createConnection(PORT, HOST, () => {
      setTimeout(() => {
        done()
      }, 1000)
    })
  })
  
  afterEach(done => {
    resetData()
    client.end(() => {
      client = null
      setTimeout(() => {
        done()
      }, 1000)
    })
  })

  after(done => {
    server.close(() => {
      done()
    })
  })

  it('should receive "allow" message to view the video of the user who shared it', done => {
    const msg1 = 'user-1 creates video-1\n'
    const msg2 = 'user-1 shares video-1 with user-2\n'
    const msg3 = 'user-2 tries to view video-1\n'
    client.write(msg1)
    client.write(msg2)
    client.write(msg3)

    client.on('data', data => {
      data = data.toString().replace(/\n/g, '')
      assert.equal(data, 'allowallow')
      done()
    })
  })

  it('should receive "deny" message to view the video that has not been shared', done => {
    const msg1 = 'user-1 creates video-1\n'
    const msg2 = 'user-2 tries to view video-1\n'
    client.write(msg1)
    client.write(msg2)

    client.on('data', data => {
      data = data.toString().replace(/\n/g, '')
      assert.equal(data, 'deny')
      done()
    })
  })
})