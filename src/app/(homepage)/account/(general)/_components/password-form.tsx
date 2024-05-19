"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import {
  updatePasswordParams,
  type UpdatePasswordParams,
} from "@/server/db/schema/user";
import { updatePasswordAction } from "@/server/actions/users";

export function PasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdatePasswordParams>({
    resolver: zodResolver(updatePasswordParams),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      if (values.newPassword !== values.confirmPassword) {
        toast.error("Passwords do not match");

        return;
      }

      const res = await updatePasswordAction(values);

      if (res.error) {
        toast.error(res.error);

        return;
      }

      toast.success("Password updated!");
      router.refresh();
    });
  });

  return (
    <Card className="bg-home-card-background">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle>User Name</CardTitle>
            <CardDescription>Used to identify your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>
                        Current Password
                      </FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Your current password"
                          disabled={isPending}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage {...field} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>New Password</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Your new password"
                          disabled={isPending}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage {...field} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Confirm your new password"
                          disabled={isPending}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage {...field} />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <span>
                    <Icons.spinner className="mr-2 h-3.5 w-3.5 animate-spin" />
                  </span>
                  Saving
                </>
              ) : (
                "Save"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
