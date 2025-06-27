import React, { useState, useEffect } from 'react'
import MovieDataService from '../services/movies'
import { Link } from 'react-router-dom'
import { Card, Container, Image, Col, Row, Button, Media, Form } from 'react-bootstrap'
import moment from 'moment'

const Movie = (props) => {
  // default movie state
  const [movie, setMovie] = useState({
    id: null,
    title: '',
    rated: '',
    reviews: []
  })

  // Search form states
  const [searchTitle, setSearchTitle] = useState("")
  const [searchRating, setSearchRating] = useState("All Ratings")
  const [currentSearchMode, setCurrentSearchMode] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [movies, setMovies] = useState([])

  const clearForm = () => {
    setSearchTitle("")
    setSearchRating("All Ratings")
    setCurrentSearchMode("")
    setCurrentPage(0)
    setMovies([])
  }

  // Fetch single movie data
  const getMovie = (id) => {
    MovieDataService.get(id)
      .then(response => {
        setMovie(response.data)
        console.log(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  useEffect(() => {
    getMovie(props.match.params.id)
  }, [props.match.params.id])

  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setMovie((prevState) => {
          prevState.reviews.splice(index, 1)
          return {
            ...prevState
          }
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  return (
    <div>
      <Container>
        {/* Optional search form at the top */}
        <Form>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Search by Title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </Col>

            <Col md={4}>
              <Form.Control
                as="select"
                value={searchRating}
                onChange={(e) => setSearchRating(e.target.value)}
              >
                <option>All Ratings</option>
                <option>G</option>
                <option>PG</option>
                <option>PG-13</option>
                <option>R</option>
              </Form.Control>
            </Col>

            <Col md={4}>
              <Button
                variant="danger"
                type="button"
                onClick={clearForm}
                className="mt-2"
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Movie Card */}
        <Row>
          <Col>
            <Image src={movie.poster + "/100px250"} fluid />
          </Col>
          <Col>
            <Card>
              <Card.Header as="h5">{movie.title}</Card.Header>
              <Card.Body>
                <Card.Text>{movie.plot}</Card.Text>
                {props.user && (
                  <Link to={`/movies/${props.match.params.id}/review`}>
                    Add Review
                  </Link>
                )}
              </Card.Body>
            </Card>

            <br />
            <h2>Reviews</h2>
            <br />

            {movie.reviews.map((review, index) => {
              return (
                <Media key={index}>
                  <Media.Body>
                    <h5>
                      {review.name + " reviewed on "}
                      {moment(review.date).format("Do MMMM YYYY")}
                    </h5>
                    <p>{review.review}</p>

                    {props.user && props.user.id === review.user_id && (
                      <Row>
                        <Col>
                          <Link
                            to={{
                              pathname: `/movies/${props.match.params.id}/review`,
                              state: { currentReview: review }
                            }}
                          >
                            Edit
                          </Link>
                        </Col>
                        <Col>
                          <Button
                            variant="link"
                            onClick={() => deleteReview(review._id, index)}
                          >
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Media.Body>
                </Media>
              )
            })}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Movie
