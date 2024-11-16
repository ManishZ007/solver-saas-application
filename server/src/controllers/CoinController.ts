import { Request, Response } from "express";
import prisma from "../config/prisma";

class coinController {
  static async freeuse(request: Request, response: Response) {
    try {
      const { user_id } = request.query;
      const data = request.body;

      const payload = {
        coin: data.coin,
        free_coin_use: data.free_coin_use,
      };

      const updateCoin = await prisma.user.update({
        where: {
          id: user_id as string,
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
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }
}

export default coinController;
