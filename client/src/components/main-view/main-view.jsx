import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { Button, Form, FormControl, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

import { setMovies } from "../../actions/actions";

import { LoginView } from "../login-view/login-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { RegistrationView } from "../registration-view/registration-view";
import { ProfileView } from "../profile-view/profile-view";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";
import { UpdateProfile } from "../update-profile/update-profile";

import "./main-view.scss";

const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerms, setSearchTerms] = useState("");

  useEffect(() => {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      setUser(localStorage.getItem("user"));
      getMovies(accessToken);
    }
  }, []);

  const getMovies = (token) => {
    console.log("Getting movies", { searchTerms });
    const queryString = new URLSearchParams({
      q: searchTerms,
    });
    axios
      .get(`https://clemflixdb.herokuapp.com/movies?${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // #1
        setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onLoggedIn = (authData) => {
    console.log(authData);
    setUser(authData.user.Username);

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    getMovies(authData.token);
  };

  const onLoggedOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.open("/", "_self");
  };

  const searchMovies = (event) => {
    event.preventDefault();
    let accessToken = localStorage.getItem("token");
    getMovies(accessToken);
  };

  // Before the movies have been loaded
  if (!movies) return <div className="main-view" />;

  return (
    <Router basename="/client">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          myFlix
        </Navbar.Brand>
        <Form inline onSubmit={searchMovies}>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
          />
          <Button variant="outline-dark">Search</Button>
        </Form>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/users">
              Profile
            </Nav.Link>
          </Nav>

          <Button variant="light" onClick={onLoggedOut}>
            <b>Log Out</b>
          </Button>
        </Navbar.Collapse>
      </Navbar>
      <br></br>
      <br></br>
      <br></br>

      <div className="main-view">
        <Route
          exact
          path="/"
          render={() => {
            if (!user)
              return <LoginView onLoggedIn={(user) => onLoggedIn(user)} />;
            return movies.map((m) => <MovieCard key={m._id} movie={m} />);
          }}
        />
        <Route path="/register" render={() => <RegistrationView />} />
        <Route
          path="/movies/:movieId"
          render={({ match }) => (
            <MovieView
              movie={movies.find((m) => m._id === match.params.movieId)}
            />
          )}
        />
        <Route
          path="/movies/director/:name"
          render={({ match }) => {
            if (!movies) return <div className="main-view" />;
            return (
              <DirectorView
                director={
                  movies.find((m) => m.Director.Name === match.params.name)
                    .Director
                }
              />
            );
          }}
        />
        <Route
          path="/movies/genres/:name"
          render={({ match }) => {
            if (!movies) return <div className="main-view" />;
            return (
              <GenreView
                genre={
                  movies.find((m) => m.Genre.Name === match.params.name).Genre
                }
              />
            );
          }}
        />
        <Route
          exact
          path="/users"
          render={() => <ProfileView movies={movies} />}
        />
        <Route path="/users/update" render={() => <UpdateProfile />} />
      </div>
    </Router>
  );
};

let mapStateToProps = (state) => {
  return { movies: state.movies };
};

export default connect(mapStateToProps, { setMovies })(MainView);
