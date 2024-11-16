"use client";
import UserData from "./page/UserData";

type ProfileProps = {
  user?: User;
  user_post: Array<PostType> | [];
};

const Profile = ({ user, user_post }: ProfileProps) => {
  return (
    <>
      <UserData user={user} user_post={user_post} />
    </>
  );
};

export default Profile;
