import http from 'http'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import compression from 'compression'

const  app = express()

app.use(morgan('dev'));
app.use(compression())
app.use(cors())

app.get('/', function (req, res) {
  res.send('hello world')
})

http.createServer(app).listen(8000);

module.exports = app;  
