const express = require('express')
const expressWs = require('express-ws')

const app = express()
expressWs(app)

const port = process.env.PORT || 3001
let connects = []

app.use(express.static('public'))//これによってpublicフォルダから自動的にindex.htmlを探し出す。

app.ws('/ws', (ws, req) => {
  connects.push(ws)

  ws.on('message', (message) => { //メッセージを受信
    const msg = JSON.parse(message)
    console.log('received:', msg)

    connects.forEach((socket) => {
      if (socket.readyState === 1) {　　//socketが通信可能か確認
        socket.send(message)
      }
    })
  })

  ws.on('close', () => { //接続の切断を受信
    connects = connects.filter((conn) => conn !== ws) //filterで
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})