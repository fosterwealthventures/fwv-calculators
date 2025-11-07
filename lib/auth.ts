import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "./prisma"
import { stripe } from "./stripe"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    session: async ({ session, token }: { session: any; token: any }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub

        // Fetch user's plan from database
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { plan: true, proChoice: true, stripeCustomerId: true }
        })

        if (user) {
          session.user.plan = user.plan.toLowerCase() as string
          session.user.proChoice = user.proChoice?.toLowerCase() as string | undefined
          session.user.stripeCustomerId = user.stripeCustomerId || undefined
        }
      }
      return session
    },
    jwt: async ({ user, token }: { user: any; token: any }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
  events: {
    createUser: async ({ user }) => {
      // Create a Stripe customer for the new user
      if (user.email) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
        })

        // Update the user with the Stripe customer ID
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customer.id }
        })
      }
    },
  },
}
