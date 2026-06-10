"use client";

import { ReactNode, useEffect, useState } from "react";
import PrimaryTabs from "@/components/Tabs/PrimaryTabs";
import { useMeetingRoomStore } from "@/stores/useMeetingRoomStore";

const TAB_HEADERS = [
  { key: "instruction", title: "Instruction" },
  { key: "communication", title: "Communication" },
  { key: "student-work", title: "Student Work" },
];

type Props = {
  instruction: ReactNode;
  communication: ReactNode;
  studentWork: ReactNode;
};

export default function TeacherAssessmentTabs({
  instruction,
  communication,
  studentWork,
}: Props) {
  const [selectedTab, setSelectedTab] = useState("instruction");
  const [hasCommunicationMounted, setHasCommunicationMounted] = useState(false);
  const { setCommunicationTabActive } = useMeetingRoomStore();

  useEffect(() => {
    setCommunicationTabActive(selectedTab === "communication");
    return () => {
      setCommunicationTabActive(false);
    };
  }, [selectedTab, setCommunicationTabActive]);

  return (
    <div>
      <PrimaryTabs
        tabs={TAB_HEADERS}
        colors="primary"
        selectedKey={selectedTab}
        onSelectionChange={(key) => {
          setSelectedTab(key);
          if (key === "communication") setHasCommunicationMounted(true);
        }}
        hidePanel
      />

      {selectedTab === "instruction" && instruction}

      {/*
       * Communication tab is always mounted so the WebRTC connection
       * and local stream stay alive when the teacher switches tabs.
       * CSS hides it without unmounting so the stream remains active
       * and PipTile (rendered via portal) can still display.
       */}
      {hasCommunicationMounted && (
        <div
          className={
            selectedTab === "communication"
              ? ""
              : "pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
          }
        >
          {communication}
        </div>
      )}

      {selectedTab === "student-work" && studentWork}
    </div>
  );
}
