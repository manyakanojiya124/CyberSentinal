import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-up",
    error: "/sign-up",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id || token.id
      return token
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
        }
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      if (url.includes("/api/auth")) return `${baseUrl}/dashboard`
      return baseUrl
    },

    async signIn({ user, account }) {
      if (!account?.provider || !user?.email) return false
      if (account.provider !== "google" && account.provider !== "github") return false

      try {
        const db = (await clientPromise).db()

        const existingUser = await db.collection("users").findOne({
          email: user.email,
        })

        const providerKey =
          account.provider === "google"
            ? "googleId"
            : account.provider === "github"
            ? "githubId"
            : null

        if (existingUser) {
          const updateData: any = {}

          if (providerKey && !existingUser[providerKey])
            updateData[providerKey] = account.providerAccountId

          if (!existingUser.username && user.name)
            updateData.username = user.name

          if (!existingUser.image && user.image)
            updateData.image = user.image

          if (Object.keys(updateData).length > 0) {
            await db.collection("users").updateOne(
              { email: user.email },
              { $set: updateData }
            )
          }
        } else {
          const newUser: any = {
            email: user.email,
            username: user.name || `user_${Date.now()}`,
            image: user.image || "",
            createdAt: new Date(),
            linkVisits: { today: 0, thisWeek: 0, thisMonth: 0 },
            linkHistory: [],
            quizHighScore: 0,
          }

          if (providerKey)
            newUser[providerKey] = account.providerAccountId

          await db.collection("users").insertOne(newUser)
        }
      } catch (err) {
        console.error("NextAuth signIn DB error:", err)
      }

      return true
    },
  },
}