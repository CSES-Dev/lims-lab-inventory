"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Dashboard</h1>
      {session && <p>Logged in</p>}
    </div>
  );
}
