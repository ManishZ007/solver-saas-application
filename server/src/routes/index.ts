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
import { resourceLimits } from "worker_threads";
import coinController from "../controllers/CoinController";
import paymentController from "../controllers/PaymentContoller";

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

//Posts
router.get("/posts", PostController.index);
router.get("/post", PostController.sort);
router.get("/single-post", PostController.single);

//Solutions
router.post("/solution", SolutionController.create);

//Rating
router.post("/rating", RatingsController.create);
router.get("/rating/:user_id", RatingsController.index);

//User profile
router.post("/update-profile", UserController.updateUser);

//Ai
router.post("/ai-response", AiController.question);

//Creditting Coin
router.post("/credit-free-coin", coinController.freeuse);

//Payment
router.post("/create-payment-intent", paymentController.client_secret);

export default router;
