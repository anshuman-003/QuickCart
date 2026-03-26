import { Inngest } from "inngest";
import User from "@/models/User";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "dailyshop-next" });

//^Inngest function to save user data to database

export const syncUserData = inngest.createFunction(
    {
        id: 'sync-user-data',
    }, {
    event: "clerk/user.created",
},
    async ({ event, step }) => {
        const { user } = event.data;
        // Save user data to database
        try {
            await connectDB();
            const user = await User.create({
                _id: user.id,
                name: user.first_name + " " + user.last_name,
                email: user.email_addresses[0].email_address,
                imageUrl: user.image_url,
            });
        } catch (error) {
            console.error("Error saving user data from inngest.js:", error);
        }
    }
);

export const syncUserDataUpdated = inngest.createFunction(
    {
        id: 'sync-user-data-updated',
    }, {
    event: "clerk/user.updated",
},
    async ({ event, step }) => {
        const { user } = event.data;
        // Update user data in database
        try {
            await connectDB();
            const updatedUser = await User.findByIdAndUpdate(
                user.id,
                {
                    name: user.first_name + " " + user.last_name,
                    email: user.email_addresses[0].email_address,
                    imageUrl: user.image_url,
                },
                { new: true }
            );
        } catch (error) {
            console.error("Error updating user data from inngest.js:", error);
        }
    }
);

export const syncUserDataDeleted = inngest.createFunction(
    {
        id: 'sync-user-data-deleted',
    }, {
    event: "clerk/user.deleted",
},
    async ({ event, step }) => {
        const { user } = event.data;
        // Delete user data from database
        try {
            await connectDB();
            await User.findByIdAndDelete(user.id);
        } catch (error) {
            console.error("Error deleting user data from inngest.js:", error);
        }
    }
);