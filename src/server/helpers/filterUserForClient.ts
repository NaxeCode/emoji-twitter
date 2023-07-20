import { User } from "@clerk/nextjs/dist/types/server";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePicture: user.profileImageUrl,
    externalUsername:
      user.externalAccounts.find(
        (externalAccount) => externalAccount.provider === "oauth_github"
      )?.username || null,
  };
};
