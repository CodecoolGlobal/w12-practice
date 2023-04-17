const express = require('express')
const path = require('path')
const app = express()
const port = 9000

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`))
})

app.use('/public', express.static(`${__dirname}/../frontend/public`))


app.get('/images', (req, res) => {
  res.sendFile(path.join(`${__dirname}/data/images.json`))
})

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`)
})