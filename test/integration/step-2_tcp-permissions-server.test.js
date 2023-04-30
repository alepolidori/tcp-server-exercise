const net = require('net')
const assert = require('assert')
const server = require('../../src/step-2_tcp-permissions-server')

describe('TCP Permissions Server', () => {
  const PORT = 9001
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

  it('should receive "allow" message to edit the video', done => {
    const msg1 = 'user-xvqqvvt creates video-ywgtra\n'
    const msg2 = 'user-xvqqvvt tries to edit video-ywgtra\n'
    client.write(msg1)
    client.write(msg2)

    client.on('data', data => {
      data = data.toString().replace(/\n/g, '')
      assert.equal(data, 'allow')
      done()
    })
  })

  it('should receive "deny" message to edit the video', done => {
    const msg1 = 'user-xvqqvvt creates video-ywgtraw\n'
    const msg2 = 'user-2 tries to edit video-ywgtraw\n'
    client.write(msg1)
    client.write(msg2)

    client.on('data', data => {
      data = data.toString().replace(/\n/g, '')
      assert.equal(data, 'deny')
      done()
    })
  })
})