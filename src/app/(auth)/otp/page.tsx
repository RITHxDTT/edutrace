<<<<<<< HEAD:src/app/page.tsx
"use client";
=======
import React from 'react'
import OtpForm from '@/app/(main)/(auth)/otp/_Components/Otpform'
>>>>>>> f77a29c003503594e2a46b840d197c99087498a7:src/app/(main)/(auth)/otp/page.tsx

import PrimaryTabs from "@/components/Tabs/PrimaryTabs";

export default function Page() {
  return (
<<<<<<< HEAD:src/app/page.tsx
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
=======
    <div>
      <OtpForm />  
    </div>
  )
}
>>>>>>> f77a29c003503594e2a46b840d197c99087498a7:src/app/(main)/(auth)/otp/page.tsx
