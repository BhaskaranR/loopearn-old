export function AddQuestionMenu() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex">
        <div className="bg-[#4ECDC4] w-16 flex items-center justify-center">
          <div className="text-white h-8 w-8 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12H19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold">Add question</h2>
          <p className="text-gray-500">Add a new question to your survey</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Free text</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Single-Select</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Multi-Select</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Picture Selection</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Rating</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Net Promoter Score (NPS)</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Ranking</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Matrix</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Statement (Call to Action)</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Consent</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>File Upload</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Date</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Schedule a meeting</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Address</span>
        </div>

        <div className="flex items-center gap-3 text-gray-700 hover:text-[#4ECDC4] cursor-pointer">
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
          <span>Contact Info</span>
        </div>
      </div>
    </div>
  );
}
