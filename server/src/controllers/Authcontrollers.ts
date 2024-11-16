import { Request, Response } from "express";
import prisma from "../config/prisma";

class AuthControllers {
  static async createUser(request: Request, response: Response) {
    try {
      const body: CreateUserProps = request.body;

      let user = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (user == null) {
        user = await prisma.user.create({
          data: body,
        });
      }

      return response
        .status(201)
        .json({ success: true, message: "user created successfully!" });
    } catch (error) {
      return response.json(500).json({
        success: false,
        message: "somthing went wrong please try again letter!",
      });
    }
  }

  static async checkUsernameAvailable(request: Request, response: Response) {
    try {
      const body = request.body;

      const checkUsername = await prisma.user.findUnique({
        where: {
          username: body.username,
        },
      });

      if (checkUsername) {
        return response.status(409).json({
          success: false,
          message: "username already taken",
        });
      }

      return response.status(200).json({
        success: true,
        message: "username is available",
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again latter!",
      });
    }
  }

  static async checkEmailAvailable(request: Request, response: Response) {
    try {
      const body = request.body;

      const checkEmail = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (checkEmail) {
        return response.status(409).json({
          success: false,
          message: "email address already in use",
        });
      }

      return response.status(200).json({
        success: true,
        message: "email is avaliable",
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again latter!",
      });
    }
  }

  static async login(request: Request, response: Response) {
    try {
      const body: LoginUserProps = request.body;

      const isLogin = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { contains: body.identifier } },
            { username: { contains: body.identifier } },
          ],
        },
      });

      if (isLogin == null) {
        return response.json({
          success: false,
          message: "user not found",
        });
      }

      return response.status(200).json({
        success: true,
        message: "user found successfully",
        user: isLogin,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again latter!",
      });
    }
  }

  static async getUserByEmail(request: Request, response: Response) {
    try {
      const body = request.body;

      const user = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (user === null) {
        return response.json({
          success: false,
          message: "user not found",
        });
      }

      return response.json({
        success: true,
        message: "user found success: fully",
        data: user,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again latter!",
      });
    }
  }
}

export default AuthControllers;
