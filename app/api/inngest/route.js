import { serve } from "inngest/next";
import { inngest , syncUserData, syncUserDataUpdated, syncUserDataDeleted } from "@/config/inngest";


// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    syncUserData,
    syncUserDataUpdated,
    syncUserDataDeleted,
  ],
});