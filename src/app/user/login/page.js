"use client";

import { SignIn } from "@clerk/nextjs";

export default function UserLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignIn path="/user/login" routing="path" signUpUrl="/user/register" />
    </div>
  );
}
