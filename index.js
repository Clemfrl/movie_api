const mongoose = require("mongoose"),
  express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const passport = require("passport");
require("./passport");
const path = require("path");

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose local data base connection
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const cors = require("cors");
const { check, validationResult } = require("express-validator");

app.use(cors());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/client", express.static(path.join(__dirname, "client", "dist")));
app.get("/client/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

let auth = require("./auth")(app);

app.get("/", (req, res) => {
  res.status(201).send("Welcome to movie API");
});

// MOVIES ENDPOINTS

// gets the full list of movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let filter = null;
    const q = req.query.q;
    if (q) {
      console.log(`Filtering movies by title="${q}"`);
      filter = {
        Title: new RegExp(q, "i"),
      };
    }
    Movies.find(filter)
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// gets the data for a single movie by name
app.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// gets the data for a single movie by genre
app.get("/movies/genres/:Name", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Name })
    .then((movies) => {
      res.status(201).json(movies.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// gets the data for a single movie by director
app.get("/movies/directors/:Name", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then((movies) => {
      res.status(201).json(movies.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// USERS ENDPOINTS

// Get all users
app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get a user by username
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Add a user
app.post(
  "/users",
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check("Username", "Username is required, at least 5 letters").isLength({
      min: 5,
    }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Update a user's info, by username
app.put("/users/:Username", (req, res) => {
  let changedFields = {};
  if (req.body.Username) {
    changedFields.Username = req.body.Username;
  }
  if (req.body.Email) {
    changedFields.Email = req.body.Email;
  }
  if (req.body.Birthday) {
    changedFields.Birthday = req.body.Birthday;
  }
  if (req.body.Password) {
    let hashedPassword = Users.hashPassword(req.body.Password);
    changedFields.Password = hashedPassword;
  }
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $set: changedFields },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Add a movie to a user's list of favorites
app.post("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Remove a movie from user's list of favorites
app.delete("/users/:Username/Movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Delete a user by username
app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});

//general error code
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
