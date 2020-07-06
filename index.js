const express = require('express');
const app = express();
const morgan = require("morgan");
const http = require('http');

http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Welcome to my film app!\n');
}).listen(8080);

app.use(express.static("public"));
app.use(morgan("common"));
app.use((err, req, res, next) => {


let topFilms = [
  {
    title: 'The Godfather',
    date: '1972'
  },
  {
    title: 'Schindler List',
    Date: '1993'
  },
  {
    title: 'Raging Bull',
    date: '1980'
  },
  {
    title: 'Lawrence of Arabia',
    date: '1962'
  },
  {
    title: 'Forrest Gump',
    Date: '1994'
  },
  {
    title: '12 Angry Men',
    date: '1957'
  },
  {
    title: 'Star Wars',
    date: '1977'
  },
  {
    title: '2001 : a space odyssey',
    date: '1968'
  },
  {
    title: 'The silence of the lambs',
    date: '1991'
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Here is my top 10 films!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/films', (req, res) => {
  res.json(topFilms);
});

});

console.log('My first Node test server is running on Port 8080.');
