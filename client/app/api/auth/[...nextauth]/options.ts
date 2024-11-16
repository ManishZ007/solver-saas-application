import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import {
  CREATE_USER_URL,
  GETUSER_BY_EMAIL_URL,
  LOGIN_USER_URL,
} from "@/lib/apiEndPoints";
import { GetUserApiResponse, LoginApiResponse } from "@/types/ApiResponse";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Identifier", type: "text" }, // Renamed field to 'identifier'
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
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        const isLoggedIn = await axios.post<LoginApiResponse>(LOGIN_USER_URL, {
          identifier: user.email,
        });

        if (!isLoggedIn.data.success) {
          const payload = {
            username: user.name?.split(" ").join(""),
            email: user.email,
            firstname: user.name?.split(" ")[0],
            lastname: user.name?.split(" ")[1],
            provider: account?.provider,
            oauth_id: account?.providerAccountId as string,
            profile_image: user.image,
          } as CreateGoogleAndGitHubUserProps;

          const newUser = await axios.post(CREATE_USER_URL, payload);

          if (!newUser) {
            return false;
          }
        }

        if (isLoggedIn.data.success) {
          return true;
        }
      }

      if (account?.provider === "github") {
        const isLoggedIn = await axios.post<LoginApiResponse>(LOGIN_USER_URL, {
          identifier: user.email,
        });

        if (!isLoggedIn.data.success) {
          const payload = {
            username: user.name?.split(" ").join(""),
            email: user.email,
            firstname: user.name?.split(" ")[0],
            lastname: user.name?.split(" ")[1],
            provider: account?.provider,
            oauth_id: account?.providerAccountId as string,
            profile_image: user.image,
          } as CreateGoogleAndGitHubUserProps;

          const newUser = await axios.post(CREATE_USER_URL, payload);

          if (!newUser) {
            return false;
          }
        }
      }

      return true;
    },

    async jwt({ token, user, session, trigger, account }) {
      if (trigger === "update") {
        console.log("updated");
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
        token.jwtToken = account?.access_token;
        token.profile_image =
          findByEmail.data.data.profile_image == ""
            ? ""
            : findByEmail.data.data.profile_image;
        token.coin = findByEmail.data.data.coin;
        token.free_coin_use = findByEmail.data.data.free_coin_use;
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
        session.user.jwtToken = token.jwtToken;
        session.user.profile_image = token.profile_image;
        session.user.coin = token.coin;
        session.user.free_coin_use = token.free_coin_use;
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
