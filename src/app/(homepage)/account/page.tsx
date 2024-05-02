import { currentUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await currentUser();

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
    </div>
  );
}
