import connectDB from "@/config/db";
import User from "@/models/User";
import { auth , getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
    
    try {
        const {userId} = getAuth(req);
        // console.log("HII : " , userId);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Galti Yaha hai" },
                { status: 401 }
            );
        }

        await connectDB();

        // change depending on your schema
        const userData = await User.findOne({ _id: userId });

        if (!userData) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, userData },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
