import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db("bookora");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),

    baseURL: process.env.BETTER_AUTH_URL,

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "user",
                input: true,
                returned: true,
            },

            phone: {
                type: "string",
                required: false,
                input: true,
                returned: true,
            },
        },
    },
});
