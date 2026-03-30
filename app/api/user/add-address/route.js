import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const {userId} = getAuth(req);
        const {address} = await req.json();

        await connectDB();

        const newAddress = await Address.create({
            ...address,
            userId,
        });

        return NextResponse.json({
            success: true,
            message: "Address added successfully",
            newAddress: newAddress,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to add address",
        }, {
            status: 500,
        });
    }
}