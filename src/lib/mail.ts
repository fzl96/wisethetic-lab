import { Resend } from "resend";
import { PasswordResetEmail } from "@/components/password-reset-email";
import { ConfirmEmailTemplate } from "@/components/confirm-email-template";
import { OrderCompletedEmail } from "@/components/order-completed-email";
import NewOrderEmail from "@/components/emails/new-order";
import type { OrderItemEmail, OrderEmail } from "@/components/emails/new-order";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "mail@wisetheticlab.store",
    to: email,
    subject: "Confirm your email",
    react: ConfirmEmailTemplate({
      link: confirmLink,
    }),
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "mail@wisetheticlab.store",
    to: email,
    subject: "Reset Password",
    react: PasswordResetEmail({
      link: confirmLink,
    }),
  });
};

export const sendOrderCompletedEmail = async (
  email: string,
  customerName: string,
  link: string,
) => {
  await resend.emails.send({
    from: "mail@wisetheticlab.store",
    to: email,
    subject: "Order Completed",
    react: OrderCompletedEmail({
      link: link,
      customerName: customerName,
    }),
  });
};

export const sendNewOrderEmail = async (
  order: OrderEmail,
  items: OrderItemEmail[],
  total: number,
) => {
  console.log("total: ", total);
  try {
    await resend.emails.send({
      from: "mail@wisetheticlab.store",
      to: "fpsdragon333@gmail.com",
      subject: "New Order",
      react: NewOrderEmail({
        order,
        items,
        total,
      }),
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
  }
};
