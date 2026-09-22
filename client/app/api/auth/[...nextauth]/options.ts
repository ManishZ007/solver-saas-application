import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import {
  GETUSER_BY_EMAIL_URL,
  LOGIN_USER_URL,
} from "@/lib/apiEndPoints";
import { GetUserApiResponse, LoginApiResponse } from "@/types/ApiResponse";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.identifier) {
          throw new Error("Identifier is required");
        }

        const isUserExist = await axios.post<LoginApiResponse>(LOGIN_USER_URL, {
          identifier: credentials.identifier,
        });

        if (!isUserExist.data.success) {
          throw new Error("no user found with credential");
        }
        return isUserExist.data.user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update") {
        return { ...token, ...session };
      }
      if (user) {
        const findByEmail = await axios.post<GetUserApiResponse>(
          GETUSER_BY_EMAIL_URL,
          { email: user.email }
        );

        token.id = findByEmail.data.data.id;
        token.username = findByEmail.data.data?.username;
        token.email = findByEmail.data.data?.email;
        token.firstname = findByEmail.data.data?.firstname;
        token.lastname = findByEmail.data.data?.lastname;
        token.profile_image =
          findByEmail.data.data.profile_image == ""
            ? ""
            : findByEmail.data.data.profile_image;
      }

      return token;
    },

    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.firstname = token.firstname;
        session.user.lastname = token.lastname;
        session.user.profile_image = token.profile_image;
      }

      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};
