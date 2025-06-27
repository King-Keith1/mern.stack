//Displays detailed info about a specific movie.
// Shows a list of reviews for that movie.
// Allows logged-in users to add, edit, or delete their reviews.

import React, { useState, useEffect } from 'react'
import MovieDataService from '../services/movies'
import { Link } from 'react-router-dom'
import { Card, Container, Image, Col, Row, Button, Media } from 'react-bootstrap';
import moment from 'moment';

const Movie = props => {
   //default state
   const [movie, setMovie] = useState({
      id: null,
      title: '',
      rated: '',
      reviews: []
   })

   //getting a specific movie's information
   const getMovie = id => {
      MovieDataService.get(id)
         .then(response => {
            setMovie(response.data)
            console.log(response.data)
         })
         .catch(e => {
            console.log(e)
         })
   }

   //renders specific movie info once- onfirst render
   useEffect(() => {
      getMovie(props.match.params.id)
   }, [props.match.params.id])

   const deleteReview = (reviewId, index) => {
      //identify review by review and user ids
      MovieDataService.deleteReview(reviewId, props.user.id)
         .then(response => {
            setMovie((prevState) => {
               //put index into splice method to remove that review from list/database
               prevState.reviews.splice(index, 1)
               return ({
                  ...prevState
               })
            })
         })
         .catch(e => {
            //print error message
            console.log(e)
         })
   }

   return (
      <div>
         {/* card to display a specific movie's information */}
         <Container>
            <Row>
               <Col>
                  <Image src={movie.poster + "/100px250"} fluid />
               </Col>
               <Col>
                  <Card>
                     <Card.Header as="h5">{movie.title}</Card.Header>
                     <Card.Body>
                        <Card.Text>
                           {movie.plot}
                        </Card.Text>
                        {props.user &&
                           <Link to={"/movies/" + props.match.params.id + "/review"}>
                              Add Review
                           </Link>}
                     </Card.Body>
                  </Card>
                  <br></br>
                  <Card>
                     <Card.Header as="h5">Reviews</Card.Header>
                     <Card.Body>
                        {movie.reviews.map((review, index) => (
                           <div key={index} className="review-card mb-3">
                              <Media>
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
                                                   pathname: "/movies/" + props.match.params.id + "/review",
                                                   state: { currentReview: review },
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
                           </div>
                        ))}
                     </Card.Body>
                  </Card>

               </Col>
            </Row>
         </Container>
      </div>
   )
}

export default Movie;