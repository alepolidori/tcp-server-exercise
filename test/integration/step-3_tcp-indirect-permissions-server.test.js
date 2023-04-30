const net = require('net')
const assert = require('assert')
const { server, resetData } = require('../../src/step-3_tcp-indirect-permissions-server')

describe('TCP Indirect Permissions Server', () => {
  const PORT = 9002
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

  it('should receive "allow" message to view the video of the user who belongs to the same team', done => {
    const msg1 = 'user-1 creates video-1\n'
    const msg2 = 'user-1 is assigned to team-1\n'
    const msg3 = 'user-2 is assigned to team-1\n'
    const msg4 = 'user-2 tries to view video-1\n'
    client.write(msg1)
    client.write(msg2)
    client.write(msg3)
    client.write(msg4)

    client.on('data', data => {
      data = data.toString().replace(/\n/g, '')
      assert.equal(data, 'allow')
      done()
    })
  })

  it('should receive "deny" message to view the video of the user who does not belongs to the same team', done => {
    const msg1 = 'user-1 creates video-1\n'
    const msg2 = 'user-1 is assigned to team-1\n'
    const msg3 = 'user-2 is assigned to team-4\n'
    const msg4 = 'user-2 tries to view video-1\n'
    client.write(msg1)
    client.write(msg2)
    client.write(msg3)
    client.write(msg4)

    client.on('data', data => {
      data = data.toString().replace(/\n/g, '')
      assert.equal(data, 'deny')
      done()
    })
  })
})