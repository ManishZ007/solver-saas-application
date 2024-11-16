import Env from "./env";

// server side
export const BASE_URL = Env.BACKEND_URL;
export const API_URL = BASE_URL + "/api";
export const AUTH_URL = API_URL + "/auth";
export const CREATE_USER_URL = AUTH_URL + "/createUser";
export const LOGIN_USER_URL = AUTH_URL + "/login";
export const CHECK_USERNAME_URL = AUTH_URL + "/checkUsernameAvailable";
export const CHECK_EMAIL_URL = AUTH_URL + "/checkEmailAvailable";
export const GETUSER_BY_EMAIL_URL = AUTH_URL + "/getUserByEmail";

// chat group route handler
export const CREATE_CHAT_GROUP_URL = API_URL + "/chat-group";
export const FETCH_CHAT_GROUPS_URL = API_URL + "/chat-groups";
export const EDIT_CHAT_GROUP_URL = API_URL + "/chat-group";
export const DELETE_CHAT_GROUP_URL = API_URL + "/chat-group";
export const GET_CHAT_GROUP = API_URL + "/chat-group";

// chat group users rout handler
export const GET_CHAT_GROUP_USERS = API_URL + "/chat-group-users";
export const STORE_CHAT_GROUP_USER = API_URL + "/chat-group-users";

// get all chats
export const GET_ALL_CHATS = API_URL + "/all-chats";

//event
export const CREATE_EVENT = API_URL + "/event";
export const GET_ALL_EVENT = API_URL + "/event";

//posts
export const FETCH_ALL_POSTS = API_URL + "/posts";
export const CREATE_POST = BASE_URL + "/create-post";
export const FETCH_USER_POST = API_URL + "/post";
export const SINGLE_POST = API_URL + "/single-post";

//post image endpoint
export const POST_IMAGE_ENDPOINT = BASE_URL + "/uploads";

//Rating handling
export const RATING_ON_SOLUTION = API_URL + "/rating";
export const FETCH_ALL_USER_RATING = API_URL + "/rating";

//Solution handling
export const SOLUTION_HANDLING = API_URL + "/solution";

//User profile
export const UPDATE_USER_PROFILE = API_URL + "/update-profile";

// client side
export const APP_CHAT_GROUP_URL = Env.APP_URL + "/dashboard/chat";

//Ai
export const AI_RESPONSE_URL = API_URL + "/ai-response";

//Coin
export const CREDIT_FREE_COIN_URL = API_URL + "/credit-free-coin";

// Payment
export const CLIENT_SECRET_URL = API_URL + "/create-payment-intent";
