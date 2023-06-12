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
    <div className="my-6 text-gray-700">
      <div className="">
        <h2 className="text-2xl mb-2">Welcome, </h2>
        <p className="text-sm">Measure How Fast You’re Growing Monthly Recurring Revenue. Learn More</p>
      </div>

    </div>
  );
}