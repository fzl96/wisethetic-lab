import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface ConfirmEmailTemplateProps {
  link: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : "";

export const ConfirmEmailTemplate = ({ link }: ConfirmEmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Confirm your email address to complete the registration process.
      </Preview>
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
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Confirm Email
            </Heading>
            <Text className="text-center text-[14px] leading-[24px] text-black">
              Confirm your email address to complete the registration process.
            </Text>
            <Text className="text-center text-[14px] leading-[24px] text-black">
              If it wasn&apos;t you, please ignore this email. If it was you,
              then confirm by clicking the link below.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={link}
              >
                Confirm Email
              </Button>
            </Section>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              If you were not expecting this request, you can ignore this email.
              If you are concerned about your account&apos;t safety, please
              contact us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ConfirmEmailTemplate;
