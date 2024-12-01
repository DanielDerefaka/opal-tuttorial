import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationData } from "@/hooks/use-mutationdata";
import { useSearch } from "@/hooks/use-search";
import { User } from "lucide-react";
import React from "react";
import Loader from "../loader";

type SearchWorkspaceProps = {
  workspaceId: string;
};

const Search = ({ workspaceId }: SearchWorkspaceProps) => {
  const { onSearchQuery, query, onUsers, isFetching } = useSearch(
    "get-users",
    "USERS"
  );

  // SENDING  INVITATIONS
  // const {mutate, isPending} = useMutationData(
  //   ['invite-member'], (data: {receiverId: string, email: string}) => inviteMember(data), 'get-users', () => {
  //   }

  // )

  return (
    <div className="flex flex-col gap-y-5 ">
      <Input
        placeholder="Search for your user....."
        onChange={onSearchQuery}
        value={query}
        className="bg-transparent border-2 outline-none"
        type="text"
      />

     

      {isFetching ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
      ) : !onUsers ? (
        <div className="w-full h-10  rounded-xl flex items-center justify-center">
          <span className="text-neutral-400 font-semibold text-xs">
            No users found
          </span>
        </div>
      ) : (
        <div>
          {onUsers &&
            onUsers.map((user) => (
              <div key={user.id}>
              <div className=" flex gap-x-3 items-center border-2 p-3 w-full rounded-xl">
                <Avatar>
                  <AvatarImage src={user.image as string} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-y-1 items-start">
                  <h3 className=" text-bold text-lg capitalize">{user.firstName} {user.lastName}</h3>
                  <p className="lowercase bg-white px-2 rounded-lg text-[#1e1e1e] text-xs">
                    {user.subscription?.plan}
                  </p>
                </div>
                <div className="flex  flex-1 justify-end items-center">
                  <Button
                    variant="default"
                    size="icon"
                    className="w-5/12 font-bold"
                    onClick={() => {}}
                  >
                    <Loader state={false} color="#000">
                      Invite
                    </Loader>
                  </Button>
                </div>
              </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;
