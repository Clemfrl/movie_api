const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();

app.use(express.static("public"));


let movies = [
  {
    id : 1,
    title: 'The Godfather',
    date: '1972',
    genre: 'Gangsters',
    director: 'Francis Ford Coppola'
  },
  {
    id : 2,
    title: 'Schindler List',
    date: '1993',
    genre: 'Drama',
    director: 'Steve Spielberg'
  },
  {
    id : 3,
    title: 'Raging Bull',
    date: '1980',
    genre: 'Drama',
    director: 'Martin Scorsese'
  }
];


let directors = []

let genres = []

// GET requests

// Gets the list of data about ALL students
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Gets the data about a movie, by name
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});

// Gets the data about a movie genre, by name
app.get('/movies/genres/:title', (req, res) => {
  res.json(genres.find((genre) =>
    { return movie.title === req.params.title }));
});


// Gets data about a director, by name
app.get('/movies/directors/:name')
res.json(directors.find((director) =>
   { return director.name === req.params.name }));
});


// Allow new users to register
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.Username) {
    const message = 'Missing Username in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Update informations of a User (username, password, email, date of birth)
app.put('/users/:Username', (req, res) => {}


// Allow users to add a movie to their list of favorites
app.post('/users/[Username]/Favorites/[movie_id]'), (req, res) => {}


// Allow users to remove a movie to their list of favorites
app.delete('/users/[Username]/Favorites/[movie_id]'), (req, res) => {}

// Allow existing users to deregister
app.delete('/users/[Username]'), (req, res) => {
  let user = users.find((user) => { return student.Username === req.params.Username });

  if (user) {
    users = users.filter((obj) => { return obj.Username !== req.params.Username });
    res.status(201).send('Your account is deleted');
  }
});



app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});


app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
