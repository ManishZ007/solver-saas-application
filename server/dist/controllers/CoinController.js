"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../config/prisma"));
class coinController {
    static async freeuse(request, response) {
        try {
            const { user_id } = request.query;
            const data = request.body;
            const payload = {
                coin: data.coin,
                free_coin_use: data.free_coin_use,
            };
            const updateCoin = await prisma_1.default.user.update({
                where: {
                    id: user_id,
                },
                data: payload,
            });
            return response.status(200).json({
                success: true,
                message: "coin credited successfully",
                data: {
                    coin: updateCoin.coin,
                    free_coin_use: updateCoin.free_coin_use,
                },
            });
        }
        catch (error) {
            response.status(500).json({
                success: false,
                message: "somthing went wrong please try again letter!",
            });
        }
    }
}
exports.default = coinController;
