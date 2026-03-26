import { Inngest } from "inngest";
import User from "@/models/User";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "dailyshop-next" });

//^Inngest function to save user data to database

export const syncUserDataCreated = inngest.createFunction(
  {
    id: "sync-user-data-created",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event, step }) => {
    const user = event.data;

    try {
      await connectDB();

      await User.create({
        _id: user.id, // ✅ matches your schema
        name: `${user.first_name || ""} ${user.last_name || ""}`,
        email: user.email_addresses[0]?.email_address,
        imageUrl: user.image_url,
        cartItems: {},
      });

    } catch (error) {
      console.error("Error creating user:", error);
    }
  }
);

export const syncUserDataUpdated = inngest.createFunction(
  {
    id: "sync-user-data-updated",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event, step }) => {
    const user = event.data;

    try {
      await connectDB();

      await User.findByIdAndUpdate(user.id, {
        name: `${user.first_name || ""} ${user.last_name || ""}`,
        email: user.email_addresses[0]?.email_address,
        imageUrl: user.image_url,
      });

    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
);

export const syncUserDataDeleted = inngest.createFunction(
  {
    id: "sync-user-data-deleted",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event, step }) => {
    const user = event.data; // ✅ FIXED

    try {
      await connectDB();

      await User.findByIdAndDelete(user.id); // ✅ works with your schema
    } catch (error) {
      console.error("Error deleting user data from inngest.js:", error);
    }
  }
);