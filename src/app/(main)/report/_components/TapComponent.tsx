"use client";

const TABS = ["All Reports", "Class Based", "Task Based"];

interface TapComponentsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TapComponents({
  activeTab,
  onTabChange,
}: TapComponentsProps) {
  return (
    <div className="bg-foreground/10 w-max p-1 space-x-3 rounded-lg">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-3 py-1 text-sm cursor-pointer transition-colors ${
            activeTab === tab
              ? "bg-white rounded-lg text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}