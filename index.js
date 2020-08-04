const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

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

// Requests from exercise 2.8

//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});



// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Requests from the exercise 2.5 

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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
