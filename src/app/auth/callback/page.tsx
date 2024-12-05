'use client';

import { onAuthenticateUser } from "@/actions/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthCallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    const authenticate = async () => {
      try {
        const auth = await onAuthenticateUser();
        
        if (auth.status === 200 || auth.status === 201) {
          router.push(`/dashboard/${auth.user?.workspace[0].id}`);
          return;
        }
        
        router.push("/auth/sign-in");
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/auth/sign-in");
      }
    };

    authenticate();
  }, [router]);

  return null;
};

export default AuthCallbackPage;
