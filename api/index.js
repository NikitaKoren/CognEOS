import http from 'http'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import compression from 'compression'
import request from 'request'

const  app = express()

app.use(morgan('dev'));
app.use(compression())
app.use(cors())


const getUserStackOverflowInfo = () => {
  request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body.url);
    console.log(body.explanation);
  });
}

app.get('/status', function (req, res) {
  res.send('Running CognEOS Node')
})

app.get('/check-stackoverflow-activity/:userId', function (req, res) {
  getUserStackOverflowInfo()
  res.send(`Check activity of a user with id: 0`)
})

http.createServer(app).listen(8000);

request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
});

module.exports = app;  
