"use client";
import React from "react";
import CardBox from "./Cardbox";
import { mockfeature } from "../_json/MockDataFeature";

export default function ConnectedSection() {
  return (
    <section className="w-full bg-bgapp py-20 flex flex-col items-center text-center px-6">
      <div className="flex items-center gap-2 bg-[#E9F6FF] px-4 py-1.5 rounded-[10px] mb-4">
        <span className="text-[#20B1E6] font-bold">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.99984 12.8346C10.2082 12.8346 12.8332 10.2096 12.8332 7.0013C12.8332 3.79297 10.2082 1.16797 6.99984 1.16797C3.7915 1.16797 1.1665 3.79297 1.1665 7.0013C1.1665 10.2096 3.7915 12.8346 6.99984 12.8346Z"
              stroke="#20B1E6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.521 6.99849L6.17183 8.64932L9.47933 5.34766"
              stroke="#20B1E6"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span className=" text-[14px] text-textColor">About</span>
      </div>
      <p className=" text-[24px] text-textDisable mb-2">
        Manage your tasks, get timely notifications, and stay connected with
        your instructors
      </p>
      <h2 className=" font-medium text-[48px] bg-accent-linear-purple bg-clip-text text-transparent">
        Everything connected to the task
      </h2>

      <div className="flex gap-26 flex-col w-[85%]  mt-[50px]">
        <div className="flex justify-between ">
          <CardBox item={mockfeature[0]} />
          <CardBox item={mockfeature[1]} />
        </div>

        <div className="flex justify-center">
          <CardBox item={mockfeature[2]} />
        </div>

        <div className="flex justify-between">
          <CardBox item={mockfeature[3]} />
          <CardBox item={mockfeature[4]} />
        </div>
      </div>
    </section>
  );
}
