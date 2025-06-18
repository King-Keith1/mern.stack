import ReviewsDAO from '../dao/reviewsDAO.js';

export default class ReviewsController {
    static async apiPostReview(req, res, next) {//apiPostReview method
        try {
            const movieId = req.body.movie_id;//get info from req.body
            const review = req.body.review;//retrieve field value
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            };
            const date = new Date();
            const ReviewResponse = await ReviewsDAO.addReview(//send info to ReviewsDAO
                movieId,
                userInfo,
                review,
                date
            );
            res.json({ status: "success " });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
     }


    static async apiUpdateReview(req, res, next) {//apiUpdateReview method
    try {
        const reviewId = req.body.review_id//extact reviewId text
        const review = req.body.review
        const date = new Date()
        const ReviewResponse = await ReviewsDAO.updateReview(//call ReviewsDAO.updateReview
            reviewId,
            req.body.user_id,//pass in user_id: ensure correct user who created the review
            review,
            date
        )
        const { error } = ReviewResponse
        if (error) {
            res.status.json({ error })
        }
        if (ReviewResponse.modifiedCount === 0) {//check modifiedCount is not zero
            throw new Error("unable to update review. User may not be original poster")
        }
        res.json({ status: "success " })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

    static async apiDeleteReview(req, res, next) {//apiDeleteReview method
    try {
        const reviewId = req.body.review_id;//extract reviewId
        const userId = req.body.user_id;//ensures correct user deleting review
        console.log(`Deleting review with review_id: ${reviewId} and user_id: ${userId}`);
        
        const ReviewResponse = await ReviewsDAO.deleteReview(reviewId, userId,);
        console.log('Review deletion response:', ReviewResponse);

        
        res.json({ status: "success " });
    } catch (e) {
        console.error(`Error deleting review: ${e.message}`);
        res.status(500).json({ error: e.message });
    }
}
}