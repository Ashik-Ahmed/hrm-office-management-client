"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession({
    required: true,
  });

  if (status === "loading") {
    return <></>
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <p className="text-xl bg-red-500">This is a protected page.</p>
        <pre>{JSON.stringify(session)}</pre>
      </div>
    </div>
  );
}