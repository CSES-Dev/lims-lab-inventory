import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// How will we log users in, and how do we remember them?

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GoogleProvider({
            clientId:
            process.env.GOOGLE_CLIENT_ID!,
            clientSecret:
            process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
});