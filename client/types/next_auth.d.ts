import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    username?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    jwtToken?: string;
    profile_image?: string;
    image?: string;
    free_coin_use?: string;
    coin?: string;
  }

  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string;
      firstname?: string;
      lastname?: string;
      jwtToken?: string;
      profile_image?: string;
      image?: string;
      free_coin_use?: string;
      coin?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    jwtToken?: string;
    profile_image?: string;
    image?: string;
    free_coin_use?: string;
    coin?: string;
  }
}
