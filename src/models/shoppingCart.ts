import { model, Schema } from 'mongoose'
import CartItem, { ICartItem } from './cartItem'
import { Iproduct } from './product'


export interface IShoppingCart{
    _id: string,
    products: Iproduct[],
    total?: number,
    cartItems: ICartItem[]
}

const ShoppingCartSchema = new Schema({
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }],
    total: {
        type: Number,
        default: 0
    },
    cartItems: [
        {
            type: Schema.Types.ObjectId,
            ref: 'CartItem'
        }
    ]
})

ShoppingCartSchema.pre(
    'deleteOne',
    { document: true, query: false },
    async function () {
        await CartItem.deleteMany({
            _id: {
                $in: this.cartItems,
            },
        });
    },
);

const ShoppingCart = model<IShoppingCart>('ShoppingCart', ShoppingCartSchema)

export default ShoppingCart