import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface OrderCompletedEmailProps {
  link: string;
  customerName: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : "";

export const OrderCompletedEmail = ({
  link,
  customerName,
}: OrderCompletedEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your order is completed! Download your photos</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/vercel-logo.png`}
                width="40"
                height="37"
                alt="Vercel"
                className="mx-auto my-0"
              />
            </Section>
            <Text className="text-xl font-bold text-gray-800">
              Hi {customerName},
            </Text>
            <Text className="text-md mt-4 text-gray-600">
              We’re excited to inform you that your order is now complete! You
              can view and download the photos of your items by clicking the
              link below:
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Google Drive
              </Button>
            </Section>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              If you have any questions or need further assistance, feel free to
              contact us. Thank you for choosing our service!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
