import React from 'react';
import axios from 'axios';

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {

    constructor() {
        super();

        this.state = {
            movies: null,
            selectedMovie: null
        };
    }

    componentDidMount() {
        console.log('componentDidMount: Fetching movies from API')
        axios.get('https://clemflixdb.herokuapp.com/movies')
            .then(response => {
                console.log('componentDidMount axios then: Setting movies as state')
                // Assign the result to the state
                this.setState({
                    movies: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onMovieClick(movie) {
        console.log(`onMovieClick: Setting "${movie.Title}" as selectedMovie in state`)
        this.setState({
            selectedMovie: movie
        });
    }

    onBackButtonClick() {
        console.log('onBackButtonClick: ...')
        this.setState({
            selectedMovie: null
        })
    }

    render() {
        const { movies, selectedMovie } = this.state;

        // Before the movies have been loaded
        if (!movies) {
            console.log('render: There are no movies, showing loading screen')
            return <div className="main-view">Loading movies...</div>;
        } else {
            console.log('render: There are movies, continuing')
        }

        let activeView = null;
        if (!selectedMovie) {
            console.log('render: There is no selected movie, rendering list')
            activeView = movies.map(movie => (
                <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
            ))
        } else {
            console.log('render: There is a selected movie, rendering movie view with detailed information')
            activeView = <MovieView movie={selectedMovie} />
        }

        return (
            <div className="main-view">
                {selectedMovie && <button onClick={() => this.onBackButtonClick()}>Back</button>}
                {activeView}
            </div>
        );
    }
}