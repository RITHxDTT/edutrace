"use client";

import React, {JSX, useMemo} from "react";
import { useSession } from "next-auth/react";
import { KnockProvider, KnockFeedProvider } from "@knocklabs/react";
import PushNotificationInitializer from "@/components/notifications/PushNotificationInitializer";

export default function KnockProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { data: session} = useSession();
  const userId = session?.user?.userId;

  // Read config from env
  const apiKey =
    process.env.NEXT_PUBLIC_KNOCK_API_KEY ||
    process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY;
  const feedId = process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID;

  // Build the user attributes object.
  const userProp = useMemo(() => {
    return userId
      ? {
          id: String(userId),
          name: session?.user?.fullName || undefined,
          email: session?.user?.email || undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          avatar: (session?.user as any)?.profileImageUrl || undefined,
        }
      : { id: "anonymous_dummy_user" };
  }, [userId, session?.user]);

    return (
    <KnockProvider apiKey={apiKey} user={userProp}>
      <KnockFeedProvider feedId={feedId}>
        <PushNotificationInitializer />
        {children}
      </KnockFeedProvider>
    </KnockProvider>
  );
}
