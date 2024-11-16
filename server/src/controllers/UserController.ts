import { Request, Response } from "express";
import prisma from "../config/prisma";

class UserController {
  static async editUserProfileImage(request: Request, response: Response) {
    try {
      const { user_id } = request.body;
      const image = request.file.filename;
      const formated_image = "http://localhost:8000/uploads/" + image;

      const update_profile = await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          profile_image: formated_image,
        },
      });

      if (update_profile == null) {
        return response.status(400).json({
          success: false,
          message: "Error while updating the profile image",
        });
      }

      return response.status(200).json({
        success: true,
        meesage: "profile image updated successfully!",
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again latter!",
      });
    }
  }

  static async updateUser(request: Request, response: Response) {
    try {
      const { email, username, user_id } = request.body;

      const updatedUser = await prisma.user.update({
        where: {
          id: user_id as string,
        },
        data: {
          email: email,
          username: username,
        },
      });

      if (updatedUser === null) {
        return response.status(400).json({
          success: false,
          message: "Error while updating the profile",
        });
      }

      return response.status(200).json({
        success: true,
        message: "profile updated successfully!",
        data: updatedUser,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "somthing went wrong please try again latter!",
      });
    }
  }
}

export default UserController;
