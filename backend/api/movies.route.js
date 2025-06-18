import express from 'express'
import MoviesController from './movies.controller.js'
import ReviewsController from './reviews.controller.js' 

// get access to express router
const router = express.Router() 

//router.route('/').get((req,res) => res.send('hello world'))
//gets full movie object
router.route('/').get(MoviesController.apiGetMovies)

//route gets specific movies and their ratings
router.route("/id/:id").get(MoviesController.apiGetMovieById)
router.route("/ratings").get(MoviesController.apiGetRatings)

//CRUD functioning for reviews
router
    .route("/review")
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview)

export default router