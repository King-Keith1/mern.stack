import React, { useState } from 'react';
import MovieDataService from '../services/movies';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import GreetingBanner from 'GreetingBanner';


//This is a functional component that receives props
const AddReview = props => {

   let editing = false
   let initialReviewState = ''

   //checks state to allow for editting to occur
   //If the component receives a currentReview via props.location.state, it means we’re in edit mode.
   if (props.location.state && props.location.state.currentReview) {
      editing = true
      initialReviewState = props.location.state.currentReview.review
   }

   //review: holds the text of the review.
   const [review, setReview] = useState(initialReviewState)
   //submitted: becomes true after the user submits the review successfully.
   const [submitted, setSubmitted] = useState(false)

   //Updates the review state as the user types in the form field.
   const onChangeReview = e => {
      const review = e.target.value
      setReview(review);
   }

   const saveReview = () => {
      var data = {
         review: review,
         name: props.user.name,
         user_id: props.user.id,
         movie_id: props.match.params.id // get movie id direct from url
      }

      if (editing) {
         // get existing review id
         data.review_id = props.location.state.currentReview._id
         MovieDataService.updateReview(data)
            .then(response => {
               setSubmitted(true);
               console.log(response.data)
            })
            .catch(e => {
               console.log(e);
            })
      }
      else {
         //create a new review
         MovieDataService.createReview(data)
            .then(response => {
               setSubmitted(true)
               console.log(response.data)
            })
            .catch(e => {
               console.log(e);
            })
      }
   }

   
   return (
      <div>
         {/* uses a ternary operator */}
         {submitted ? (
            <div>
               <h4>Review submitted successfully</h4>
               <Link to={'/movies/' + props.match.params.id}>
                 <GreetingBanner user={props.user} /> Back to Movie
               </Link>
            </div>
         ) : (
            <Form>
               <Form.Group>
                  <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
                  <Form.Control
                     type="text"
                     required
                     value={review}
                     onChange={onChangeReview}
                  />
               </Form.Group>
               <Button variant="primary" onClick={saveReview}>
                  Submit
               </Button>
            </Form>
         )}
      </div>
   )
}

export default AddReview;