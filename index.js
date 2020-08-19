const mongoose = require('mongoose'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const passport = require('passport');
require('./passport');

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static("public"));

let auth = require('./auth')(app);


app.get('/', (req, res) => {
    res.status(201).send('Welcome to movie API');
});

// gets the full list of movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// gets the data for a single movie by name
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// gets the data for a single movie by genre
app.get('/movies/genres/:Name', (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
        .then((movies) => {
            res.status(201).json(movies.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// gets the data for a single movie by director
app.get('/movies/directors/:Name', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
        .then((movies) => {
            res.status(201).json(movies.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

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
                    .then((user) => { res.status(201).json(user) })
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
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
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

// Allow users to add a movie to their list of favorites
app.post('/users/[Username]/Favorites/[movie_id]'), (req, res) => { }

// Allow users to remove a movie to their list of favorites
app.delete('/users/[Username]/Favorites/[movie_id]'), (req, res) => { }

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
    console.log('My first Node test server is running on Port 8080.');
});

//general error code
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});