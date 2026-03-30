import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const { address, items } = await req.json()

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid Data..." })
        }

        //Calculate amount using items
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product)
            return acc + product.offerPrice * item.quantity;
        }, 0);

        //Create Order Using Inngest 

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.2), //tax calculated 2%
                date: Date.now()
            }
        })

        // Clear User Cart Data
        const user = await User.findById(userId)
        user.cartItems = {};
        await user.save();

        return NextResponse.json({ success: true, message: 'Order Placed' })

    } catch (error) {

        return NextResponse.json({ success: false, message: error.message })
    }
}