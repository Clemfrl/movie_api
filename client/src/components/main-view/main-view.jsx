import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { LoginView } from "../login-view/login-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
    };
  }

  getMovies(token) {
    axios
      .get("https://clemflixdb.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assign the result to the state
        this.setState({
          movies: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
    }
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
    });

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
    window.open("/", "_self");
  }

  onMovieClick(movie) {
    console.log(
      `onMovieClick: Setting "${movie.Title}" as selectedMovie in state`
    );
    this.setState({
      selectedMovie: movie,
    });
  }

  onBackButtonClick() {
    console.log("onBackButtonClick: ...");
    this.setState({
      selectedMovie: null,
    });
  }

  render() {
    const { movies, selectedMovie, user } = this.state;

    if (!user)
      return <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />;

    // Before the movies have been loaded
    if (!movies) {
      console.log("render: There are no movies, showing loading screen");
      return <div className="main-view">Loading movies...</div>;
    } else {
      console.log("render: There are movies, continuing");
    }

    let activeView = null;
    if (!selectedMovie) {
      console.log("render: There is no selected movie, rendering list");
      activeView = movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          onClick={(movie) => this.onMovieClick(movie)}
        />
      ));
    } else {
      console.log(
        "render: There is a selected movie, rendering movie view with detailed information"
      );
      activeView = (
        <MovieView
          movie={selectedMovie}
          onBackButtonClick={() => this.onBackButtonClick()}
        />
      );
    }

    return <div className="main-view">{activeView}</div>;
  }
}
