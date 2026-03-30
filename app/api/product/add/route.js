//configure cloudinary
import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    try {
        const {userId} = getAuth(req);
        
        //check if user is Seller using /lib/authSeller.js file/function
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json(
                { success: false, message: "Not a seller" },
                { status: 401 }
            );
        }

        const data = await req.formData();

        const name = data.get("name");
        const description = data.get("description");
        const price = data.get("price");
        const offerPrice = data.get("offerPrice");
        const category = data.get("category");

        const files = data.getAll("images");

        if(!files || files.length === 0) {
            return NextResponse.json(
                { success: false, message: "No images provided" },
                { status: 400 }
            );
        }

        //Files uploading to cloudinary
        const result = await Promise.all(
            files.map(async (file) => { //added async here to make sure all files are uploaded before proceeding
                const arrayBuffer = await file.arrayBuffer(); //added await here to convert file to arrayBuffer before creating buffer
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({
                        resource_type: "auto",
                    }, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });

                    stream.end(buffer);
                }
                );
            })
        );
        
        //all images uploaded successfully in result variable
        const image = result.map((res) => res.secure_url);

        //Save product data to database 
        await connectDB();
        
        const newProduct = await Product.create({
            userId,
            name,
            description,
            price:Number(price),
            offerPrice:Number(offerPrice),
            category,
            image,
            Date: Date.now(),
        });
        console.log("product created");
        

        return NextResponse.json(
            { success: true, message: "Product added successfully to the Database", product: newProduct },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error uploading files to Database" },
            { status: 500 }
        );
    }
}