import { model, Schema } from 'mongoose'
import { Iproduct } from './product'


export interface ICartItem {
    _id: string
    image: string,
    name: string,
    price: number,
    item_id: string
}

const CartItemSchema = new Schema<ICartItem>({
    image: String,
    name: String,
    price: Number,
    item_id: String
})

const CartItem = model<ICartItem>('CartItem', CartItemSchema)

export default CartItem