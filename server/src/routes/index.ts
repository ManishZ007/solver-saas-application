import { Router } from "express";
import AuthControllers from "../controllers/Authcontrollers";
import ChatGroupController from "../controllers/ChatGroupController";
import ChatGroupUserController from "../controllers/ChatGroupUserController";
import ChatController from "../controllers/ChatController";
import EventController from "../controllers/EventController";
import PostController from "../controllers/PostController";
import SolutionController from "../controllers/SolutionController";
import RatingsController from "../controllers/RatingsController";
import UserController from "../controllers/UserController";
import AiController from "../controllers/AIController";
import NotificationController from "../controllers/NotificationController";
import LeaderboardController from "../controllers/LeaderboardController";
import ContestController from "../controllers/ContestController";
const router = Router();

// authentication
router.post("/auth/createUser", AuthControllers.createUser);
router.post("/auth/login", AuthControllers.login);
router.post(
  "/auth/checkUsernameAvailable",
  AuthControllers.checkUsernameAvailable
);
router.post("/auth/checkEmailAvailable", AuthControllers.checkEmailAvailable);
router.post("/auth/getUserByEmail", AuthControllers.getUserByEmail);

//chat group routers
router.post("/chat-group", ChatGroupController.store); //create group
router.get("/chat-groups/:user_id", ChatGroupController.index); //showing all group of user
router.get("/chat-group/:id", ChatGroupController.show); //showing single group
router.put("/chat-group/:id", ChatGroupController.update); //update group
router.delete("/chat-group/:id", ChatGroupController.delete); //delete single group

// Chat group users
router.get("/chat-group-users", ChatGroupUserController.index);
router.post("/chat-group-users", ChatGroupUserController.store);

//Chat
router.get("/all-chats", ChatController.getAllChats);

//Events
router.get("/event", EventController.index);
router.post("/event", EventController.store);
router.put("/event/:id", EventController.update);
router.delete("/event/:id", EventController.destroy);

//Posts
router.get("/posts", PostController.index);
router.get("/post", PostController.sort);
router.get("/single-post", PostController.single);
router.put("/post/:id", PostController.update);
router.delete("/post/:id", PostController.destroy);

//Solutions
router.post("/solution", SolutionController.create);
router.post("/solution/mark-solved", SolutionController.markSolved);

//Rating
router.post("/rating", RatingsController.create);
router.post("/rating/toggle", RatingsController.toggle);
router.get("/rating/:user_id", RatingsController.index);

//User profile
router.post("/update-profile", UserController.updateUser);

//Ai
router.post("/ai-response", AiController.question);
router.post("/ai-judge", AiController.judgeSolutions);

//Notifications
router.get("/notifications", NotificationController.index);
router.post("/notifications/mark-read", NotificationController.markRead);

//Leaderboard
router.get("/leaderboard", LeaderboardController.index);

//Contests
router.get("/contests", ContestController.index);
router.get("/contest/:id", ContestController.show);
router.post("/contest", ContestController.store);
router.post("/contest/join", ContestController.join);
router.post("/contest/submit", ContestController.submit);
router.get("/contest/submissions", ContestController.userSubmissions);

export default router;
