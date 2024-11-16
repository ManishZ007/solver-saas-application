"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authcontrollers_1 = __importDefault(require("../controllers/Authcontrollers"));
const ChatGroupController_1 = __importDefault(require("../controllers/ChatGroupController"));
const ChatGroupUserController_1 = __importDefault(require("../controllers/ChatGroupUserController"));
const ChatController_1 = __importDefault(require("../controllers/ChatController"));
const EventController_1 = __importDefault(require("../controllers/EventController"));
const PostController_1 = __importDefault(require("../controllers/PostController"));
const SolutionController_1 = __importDefault(require("../controllers/SolutionController"));
const RatingsController_1 = __importDefault(require("../controllers/RatingsController"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const AIController_1 = __importDefault(require("../controllers/AIController"));
const CoinController_1 = __importDefault(require("../controllers/CoinController"));
const PaymentContoller_1 = __importDefault(require("../controllers/PaymentContoller"));
const router = (0, express_1.Router)();
// authentication
router.post("/auth/createUser", Authcontrollers_1.default.createUser);
router.post("/auth/login", Authcontrollers_1.default.login);
router.post("/auth/checkUsernameAvailable", Authcontrollers_1.default.checkUsernameAvailable);
router.post("/auth/checkEmailAvailable", Authcontrollers_1.default.checkEmailAvailable);
router.post("/auth/getUserByEmail", Authcontrollers_1.default.getUserByEmail);
//chat group routers
router.post("/chat-group", ChatGroupController_1.default.store); //create group
router.get("/chat-groups/:user_id", ChatGroupController_1.default.index); //showing all group of user
router.get("/chat-group/:id", ChatGroupController_1.default.show); //showing single group
router.put("/chat-group/:id", ChatGroupController_1.default.update); //update group
router.delete("/chat-group/:id", ChatGroupController_1.default.delete); //delete single group
// Chat group users
router.get("/chat-group-users", ChatGroupUserController_1.default.index);
router.post("/chat-group-users", ChatGroupUserController_1.default.store);
//Chat
router.get("/all-chats", ChatController_1.default.getAllChats);
//Events
router.get("/event", EventController_1.default.index);
router.post("/event", EventController_1.default.store);
//Posts
router.get("/posts", PostController_1.default.index);
router.get("/post", PostController_1.default.sort);
router.get("/single-post", PostController_1.default.single);
//Solutions
router.post("/solution", SolutionController_1.default.create);
//Rating
router.post("/rating", RatingsController_1.default.create);
router.get("/rating/:user_id", RatingsController_1.default.index);
//User profile
router.post("/update-profile", UserController_1.default.updateUser);
//Ai
router.post("/ai-response", AIController_1.default.question);
//Creditting Coin
router.post("/credit-free-coin", CoinController_1.default.freeuse);
//Payment
router.post("/create-payment-intent", PaymentContoller_1.default.client_secret);
exports.default = router;
