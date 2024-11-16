import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Users } from "lucide-react";
import { FetchChatGroupUserType } from "@/types/ApiResponse";

const ShowUsers = ({
  users,
}: {
  users: Array<FetchChatGroupUserType> | [];
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={`ghost`} size="icon">
          <Users className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {users.length > 0 ? (
          <>
            {users.map((user, index) => (
              <DropdownMenuItem key={index}>{user.username}</DropdownMenuItem>
            ))}
          </>
        ) : (
          <>
            <DropdownMenuItem>no users</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShowUsers;
