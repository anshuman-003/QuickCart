
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, ref: 'user', required: true },
    amount: { type: Number, required: true },
    address: { type: String, ref: 'address', required: true },
    status: { type: String, default: 'Order Placed', required: true },
    date: { type: Number, required: true },
    items: [{
        product: { type: String, required: true, ref: 'product' },
        quantity: { type: Number, required: true }
 
    }],

})

const Order = mongoose.models.Order || mongoose.model("order", orderSchema)

export default Order;