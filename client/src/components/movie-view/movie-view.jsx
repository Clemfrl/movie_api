import React from "react";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { movie, onBackButtonClick } = this.props;

    if (!movie) return null;

    return (
      <div>
        <Card style={{ width: "20rem" }}>
          <Card.Img variant="top" src={movie.ImagePath} />
          <Card.Body>
            <Card.Title>{movie.Title}</Card.Title>
            <Card.Text>Description: {movie.Description}</Card.Text>
            <Card.Text>Genre: {movie.Genre.Name}</Card.Text>
            <Card.Text>Director: {movie.Director.Name}</Card.Text>

            <Button onClick={() => onBackButtonClick(movie)}>Back</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onBackButtonClick: PropTypes.func.isRequired,
};
