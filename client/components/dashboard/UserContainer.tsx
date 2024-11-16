import { ArrowRight } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";

type UserContainerProps = {
  user?: User;
};

const UserContainer = ({ user }: UserContainerProps) => {
  return (
    <div className="w-full max-h-[200px] md:min-w-[230px]   p-3 flex flex-col gap-2 text-center items-center justify-center border border-solid boredr-[#222222]/10 rounded-3xl ">
      <div className="w-16 h-16">
        {user?.profile_image?.length ? (
          <>
            <Image
              src={!user.profile_image ? user.image : user.profile_image}
              alt="user profile"
              width={100}
              height={100}
              className="h-auto w-full bg-cover rounded-full"
            />
          </>
        ) : (
          <>
            <p className="h-16 w-16 text-2xl rounded-full border flex items-center justify-center">
              {user?.username?.charAt(0)}
            </p>
          </>
        )}
      </div>

      <h1 className="text-xl ">{user?.username}</h1>
      <p className="text-muted-foreground text-sm">{user?.email}</p>
      <Separator />
      <div className="flex items-center justify-center gap-2 cursor-pointer ">
        <p>view profile</p> <ArrowRight className="h-4 w-4 " />
      </div>
    </div>
  );
};

export default UserContainer;
