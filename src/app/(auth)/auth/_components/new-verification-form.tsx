"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HashLoader } from "react-spinners";
import { newVerification } from "@/server/actions/new-verification";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import Link from "next/link";

export function NewVerificationForm() {
  const { theme } = useTheme();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((response) => {
        setSuccess(response.success ?? "");
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <>
      <div className="flex flex-col items-center gap-10">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-medium">Wisethetic Lab</h1>
          <p className="text-balance text-muted-foreground">
            Confirming your email
          </p>
        </div>
        {!success && !error && (
          <HashLoader color={theme === "dark" ? "white" : "black"} />
        )}
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        <p className="underline">
          <Link href="/auth/sign-in">Back to Sign In</Link>
        </p>
      </div>
    </>
  );
}
