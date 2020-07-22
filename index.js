const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid');

const app = express();

app.use(express.static("public"));


let movies = [
  {
    title: 'The Godfather',
    date: '1972',
    genre: 'Gangsters',
    director: 'Francis Ford Coppola'
  },
  {
    title: 'Schindler List',
    date: '1993',
    genre: 'Drama',
    director: 'Steven Spielberg'
  },
  {
    title: 'Raging Bull',
    date: '1980',
    genre: 'Drama',
    director: 'Martin Scorsese'
  }
];


let directors = [
  {
    name: 'Francis Ford Coppola',
    birth:'1939',
    death:'',
    bio: 'Francis Ford Coppola, born April 7, 1939 is an American retired film director, producer, screenwriter, and film composer... ',
  },
  {
    name: 'Steven Spielberg',
    birth:'1946',
    death:'',
    bio: 'Steven Allan Spielberg is an American film director, producer, and screenwriter. He is considered one of the founding pioneers of the New Hollywood era and one of the most popular directors and producers in film history.',
  },
  {
    name: 'Martin Scorsese',
    birth:'1942',
    death:'',
    bio: 'Martin Scorsese is an American-Italian movie director. He was born in Queens and raised in Manhattan. Many of Scorseses movies have Italian American, Roman Catholic and violent themes or ideas.',
  }
];

let genres = [
  {
    Drama: 'Within film, television and radio (but not theatre), drama is a genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone,[2] focusing on in-depth development of realistic characters who must deal with realistic emotional struggles. A drama is commonly considered the opposite of a comedy, but may also be considered separate from other works of some broad genre, such as a fantasy.'
  },
  {
    Gangsters: 'Literature that focuses on gangs, criminal organizations that provide a level of organization, and resources that support much larger and more complex criminal transactions than an individual criminal could achieve. Gangsters are the subject of many movies, particularly from the period between 1930 and 1960. A revival of gangster type movies took place since the 1990s with the explosion of hip-hop culture. Unlike the earlier gangster films, the newer films share similar elements to the older films but is more in a hip-hop urban setting.'
  }
];

// GET requests

// Gets the list of data about ALL movies
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
app.get('/movies/directors/:name', (req, res) => {
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
app.put('/users/:Username'), (req, res) => {}


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
};



app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});


app.listen(8080, () => {
  console.log('Your app is listening on port 8080');
});
