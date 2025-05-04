"use client";

import { useState } from "react";

export function QuestionTypeList() {
  const [selectedType, setSelectedType] = useState<string | null>("nps");

  const questionTypes = [
    {
      id: "free-text",
      name: "Free text",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <path
            d="M8 12H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 16H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 8H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
      description: "",
    },
    {
      id: "single-select",
      name: "Single-Select",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <rect
            x="3"
            y="6"
            width="18"
            height="4"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="3"
            y="14"
            width="18"
            height="4"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
      description: "",
    },
    {
      id: "multi-select",
      name: "Multi-Select",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <rect
            x="3"
            y="6"
            width="18"
            height="4"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="3"
            y="14"
            width="18"
            height="4"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7 8H8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7 16H8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      description: "Ask respondents to choose one or more options",
    },
    {
      id: "picture-selection",
      name: "Picture Selection",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M3 8H21" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 21V8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      description: "",
    },
    {
      id: "rating",
      name: "Rating",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <path
            d="M12 3L14.5 8.5L21 9.5L16.5 14L17.5 20.5L12 17.5L6.5 20.5L7.5 14L3 9.5L9.5 8.5L12 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      description: "",
    },
    {
      id: "nps",
      name: "Net Promoter Score (NPS)",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <rect
            x="3"
            y="9"
            width="18"
            height="6"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M7 12H17" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 9V15" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      description: "Measure Net-Promoter-Score (0-10)",
    },
    {
      id: "ranking",
      name: "Ranking",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <path
            d="M4 6H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 10H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 14H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 18H20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      description: "",
    },
    {
      id: "matrix",
      name: "Matrix",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 15H21" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 3V21" stroke="currentColor" strokeWidth="1.5" />
          <path d="M15 3V21" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      description: "",
    },
    {
      id: "statement",
      name: "Statement (Call to Action)",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <path
            d="M12 5V12L15 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
      description: "",
    },
    {
      id: "consent",
      name: "Consent",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <path
            d="M5 12L10 17L19 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      description: "",
    },
    {
      id: "file-upload",
      name: "File Upload",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <path
            d="M12 15V3M12 3L8 7M12 3L16 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12H4V20H20V12H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      description: "",
    },
    {
      id: "date",
      name: "Date",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M16 2V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 2V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      description: "",
    },
    {
      id: "schedule",
      name: "Schedule a meeting",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M16 2V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 2V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M10 14H14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 12V16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      description: "",
    },
    {
      id: "address",
      name: "Address",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12H15V22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      description: "",
    },
    {
      id: "contact",
      name: "Contact Info",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#4ECDC4]"
        >
          <path
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      description: "",
    },
  ];

  return (
    <div className="p-4 space-y-0">
      {questionTypes.map((type) => (
        <div
          key={type.id}
          className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-50 ${selectedType === type.id ? "bg-blue-50" : ""}`}
          onClick={() => setSelectedType(type.id)}
        >
          <div className="flex items-center gap-3">
            {type.icon}
            <span
              className={
                selectedType === type.id ? "text-[#4ECDC4]" : "text-gray-700"
              }
            >
              {type.name}
            </span>
          </div>
          {selectedType === type.id && type.description && (
            <div className="text-gray-500 text-sm">{type.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
