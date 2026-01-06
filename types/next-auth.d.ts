import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    isAdmin?: boolean;
    role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
      role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
    role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  }
}
