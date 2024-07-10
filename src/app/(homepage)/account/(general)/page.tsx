import { NameForm } from "./_components/name-form";
import { getUserAccount } from "@/server/api/users/queries";
import { PasswordForm } from "./_components/password-form";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { SignOutButton } from "./_components/sign-out-button";

export default async function GeneralSettings() {
  const account = await getUserAccount();
  return (
    <div className="space-y-5">
      <NameForm />
      {!account && <PasswordForm />}
      <SignOutButton />
    </div>
  );
}
