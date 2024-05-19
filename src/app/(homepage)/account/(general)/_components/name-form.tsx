"use client";

import { useSession } from "next-auth/react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

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
import { z } from "zod";
import { useCurrentUser } from "@/hooks/use-current-user";
import { updateUserNameAction } from "@/server/actions/users";

const UpdateNameParams = z.object({
  name: z.string().min(3).max(255),
});

export function NameForm() {
  const { update } = useSession();
  const user = useCurrentUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UpdateNameParams>>({
    resolver: zodResolver(UpdateNameParams),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      const res = await updateUserNameAction(values);

      if (res.error) {
        toast.error(res.error);

        return;
      }

      toast.success(res.message);
      router.refresh();
      await update();
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Name</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Your account name"
                          disabled={isPending}
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
