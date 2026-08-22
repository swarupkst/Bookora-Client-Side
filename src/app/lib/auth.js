import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";

import clientPromise from "./mongodb";

const client = await clientPromise;

const db = client.db(
  process.env.MONGODB_DATABASE ||
    "bookora"
);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  baseURL:
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000",

  secret:
    process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        "",

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        "",
    },
  },

  session: {
    expiresIn:
      60 * 60 * 24 * 7,

    updateAge:
      60 * 60 * 24,
  },

  plugins: [
    jwt(),
    nextCookies(),
  ],
});