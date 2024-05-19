/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { SigninSchema } from "./lib/schemas";
import { getUserByEmail } from "./server/db/data/user";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { getUserById } from "./server/db/data/user";
import { carts, users } from "./server/db/schema";

import bcrypt from "bcryptjs";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = SigninSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;
        const user = await getUserByEmail(email);

        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return null;

        return { email: user.email, name: user.name, id: user.id };
      },
    }),
  ],
  events: {
    async linkAccount({ user }) {
      if (!user.id) return;
      await db
        .update(users)
        .set({
          emailVerified: new Date(),
        })
        .where(eq(users.id, user.id));
      await db.insert(carts).values({ userId: user.id });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;
      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER";
      }

      if (token.cartId && session.user) {
        session.user.cartId = token.cartId as string;
      }

      if (token.cartItemsCount && session.user) {
        session.user.cartItemsCount = token.cartItemsCount as number;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email ?? "";
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.cartId = existingUser.cartId;
      token.cartItemsCount = existingUser.cartItemsCount;

      return token;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
