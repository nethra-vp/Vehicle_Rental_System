"use client";

import { SignIn } from "@clerk/nextjs";

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignIn path="/admin/login" routing="path" signUpUrl="/admin/register" />
    </div>
  );
}
