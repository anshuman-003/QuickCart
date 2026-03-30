import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const {userId} = getAuth(request);
        // Fetch the user's cart from the database
        await connectDB();
        const user = await User.findById(userId);
        const cartItems = user.cartItems || {};

        return NextResponse.json({ success: true, cartItems , message: "Cart fetched successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "An error occurred while fetching the cart" }, { status: 500 });
    }
}