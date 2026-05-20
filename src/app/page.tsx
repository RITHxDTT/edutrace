"use client";

import PrimaryTabs from "@/components/Tabs/PrimaryTabs";

export default function Page() {
  return (
    <PrimaryTabs
      tabs={[
        {
          key: "photos",
          title: "Photos",
          content: <p>Photos content</p>,
        },
        {
          key: "music",
          title: "Music",
          content: <p>Music content</p>,
        },
      ]}

    />
  );
}