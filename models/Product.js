import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type: String, ref: "user", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    category: { type: String, required: true },
    image: { type: Array, required: true },
    Date: { type: Number, required: true },
});

const Product = mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
