import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { siteConfig } from "@/config/site";
import * as React from "react";
import { format } from "date-fns";

export type OrderEmail = {
  id: string;
  contactName: string;
  brandName: string;
};

export type OrderItemEmail = {
  packageName: string;
  productName: string;
  categoryName: string;
  additionalContentQuantity: number;
  total: number;
};

interface NewOrderEmailProps {
  order: OrderEmail;
  items: OrderItemEmail[];
  total: number;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export const NewOrderEmail = ({ order, items, total }: NewOrderEmailProps) => {
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  return (
    <Html>
      <Head />
      <Preview>
        We have a new order! New order received from {order.contactName}
      </Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 py-4 font-firaSans">
          <Container
            style={{ border: "1px solid #cccccc" }}
            className="rounded-lg bg-white px-8 py-4"
          >
            <Section className="">
              <Text className="font-firaSans text-xl uppercase tracking-[0.25em] text-[#ce9651]">
                {siteConfig.name}
              </Text>
            </Section>
            <Section className="">
              <Text className="font-firaSans text-2xl font-semibold text-[#484848]">
                New Order Received
              </Text>
              <Text className="text-base text-[#808080]">
                {order.contactName} · {format(new Date(), "MMMM dd, yyyy")}
              </Text>
            </Section>
            <Hr className="border-[#cccccc]" />
            <Section className="text-base text-[#808080]">
              {items.map((item, index) => (
                <Row className="mt-2 text-base" key={index}>
                  <Column className="">
                    <Text className="m-0 text-[#808080]">
                      {item.categoryName} · {item.packageName}
                    </Text>
                    <Text className="m-0 text-[#808080]">
                      {item.productName}
                    </Text>
                    <Text className="m-0 text-[#808080]">
                      {item.additionalContentQuantity} additional content(s)
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-right">
                      {currencyFormatter.format(item.total)}
                    </Text>
                  </Column>
                </Row>
              ))}
              <Row className="mt-2 text-[#484848]">
                <Column>
                  <Text className="text-base font-semibold">Total (IDR)</Text>
                </Column>
                <Column>
                  <Text className="text-right text-base font-semibold">
                    {currencyFormatter.format(total)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Hr className="border-[#cccccc]" />
            <Section className="text-center">
              <Text className="text-[#808080]">
                Visit the dashboard to see more details.
              </Text>
              <Section className="mb-6 text-center">
                <Button
                  className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                  href={`${baseUrl}/dashboard`}
                >
                  Dashboard
                </Button>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewOrderEmail;
