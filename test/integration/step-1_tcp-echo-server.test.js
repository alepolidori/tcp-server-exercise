const net = require('net')
const assert = require('assert')
const server = require('../../src/step-1_tcp-echo-server')

describe('TCP Echo Server', () => {
  const PORT = 9000
  const HOST = 'localhost'
  let client

  beforeEach(done => {
    client = net.createConnection(PORT, HOST, () => {
      done();
    });
  })

  afterEach(done => {
    client.end(() => {
      server.close(() => {
        done()
      })
    })
  })

  it('should exchange messages with the echo server, receiving the same message that has been sent', () => {
    const msg = 'example of an echo message'
    client.write(msg)

    client.on('data', data => {
      assert.equal(data.toString(), msg)
    })
  })
})