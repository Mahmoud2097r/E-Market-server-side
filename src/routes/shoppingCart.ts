import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { postShoppingCart, updateShoppingCart } from '../controllers/shoppingCarts'



const shoppingCartRouter = Router()

shoppingCartRouter.post('/',expressAsyncHandler(postShoppingCart))

shoppingCartRouter.patch('/:shoppingCart_id', expressAsyncHandler(updateShoppingCart))



export default shoppingCartRouter