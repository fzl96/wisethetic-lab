import { NameForm } from "./_components/name-form";
import { getUserAccount } from "@/server/api/users/queries";
import { PasswordForm } from "./_components/password-form";

export default async function GeneralSettings() {
  const account = await getUserAccount();
  return (
    <div className="space-y-5">
      <NameForm />
      {!account && <PasswordForm />}
    </div>
  );
}
