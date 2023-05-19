import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { postReview, patchReview, deleteReview } from '../controllers/reviews';

const reviewsRouter = Router({mergeParams: true});

reviewsRouter.post('/', expressAsyncHandler(postReview))


reviewsRouter.route('/:review_id')
    .patch(expressAsyncHandler(patchReview))
    .delete(expressAsyncHandler(deleteReview))

export default reviewsRouter;
