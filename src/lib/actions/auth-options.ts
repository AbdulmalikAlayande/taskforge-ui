// This file should be deleted - use client-side NextAuth directly in components
// The error occurs because you can't use client-side NextAuth functions in server actions

// Instead, use signIn from "next-auth/react" directly in your components like this:
/*
import { signIn, signOut } from "next-auth/react";
import { toast } from "sonner";

// In your component:
const handleSocialLogin = async (provider: string) => {
  try {
    const result = await signIn(provider, {
      callbackUrl: "/auth/success",
      redirect: false,
    });

    if (result?.error) {
      toast.error(`${provider} login failed`, {
        description: result.error === "AccessDenied" 
          ? "Access was denied. Please try again." 
          : "Something went wrong. Please try again.",
      });
    } else if (result?.ok) {
      toast.success("Login successful!");
      // Handle success - NextAuth will redirect automatically if redirect: true
    }
  } catch (error) {
    toast.error("Login failed");
  }
};
*/

// This file is kept for reference but should not be used
export const deprecatedLogin = () => {
	throw new Error(
		"Use signIn from 'next-auth/react' directly in components instead"
	);
};

export const deprecatedLogout = () => {
	throw new Error(
		"Use signOut from 'next-auth/react' directly in components instead"
	);
};
