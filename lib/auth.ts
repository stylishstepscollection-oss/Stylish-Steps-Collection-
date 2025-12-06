// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }
        
        await connectDB();
        
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check if user signed up with Google
        if (!user.password) {
          throw new Error('Please sign in with Google');
        }
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            // Update user info if needed
            if (!existingUser.image && user.image) {
              existingUser.image = user.image;
              await existingUser.save();
            }
            return true;
          }
          
          // Create new user for Google sign-in
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            password: Math.random().toString(36), // Random password for Google users
            role: 'user',
          });
          
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      
      return true;
    },
   async jwt({ token, user, trigger, session }) {
  // Initial sign in
  if (user) {
    await connectDB();
    const dbUser = await User.findOne({ email: user.email });
    
    if (dbUser) {
      token.id = dbUser._id.toString();
      token.role = dbUser.role;
      token.createdAt = dbUser.createdAt?.toISOString() || new Date().toISOString();
      token.image = dbUser.image || user.image;
      token.name = dbUser.name;
    }
  }
  
  // Handle session updates
  if (trigger === 'update' && session) {
    if (session.user?.image !== undefined) {
      token.image = session.user.image;
    }
    if (session.user?.name) {
      token.name = session.user.name;
    }
  }
  
  return token;
},
  async session({ session, token, trigger, newSession }) {
  if (session.user) {
    session.user.id = token.id as string;
    session.user.role = token.role as 'user' | 'admin';
    session.user.createdAt = token.createdAt as string;
    
    // If session was explicitly updated with new data, use that data
    if (trigger === 'update' && newSession) {
      session.user.image = newSession.user?.image ?? token.image as string;
      session.user.name = newSession.user?.name ?? token.name as string;
    } else {
      session.user.image = token.image as string;
    }
  }
  return session;
},
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};