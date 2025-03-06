import { cn } from "../utils";

export function ExpandingArrow({ className }: { className?: string }) {
  return (
    <div className="group relative flex items-center">
      <svg
        className={cn(
          "absolute h-4 w-4 transition-all group-hover:translate-x-1 group-hover:opacity-0",
          className,
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 16 16"
        width="16"
        height="16"
      >
        <path
          fillRule="evenodd"
          d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"
        />
      </svg>
      <svg
        className={`${
          className ? className : "h-4 w-4"
        } absolute opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100`}
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 16 16"
        width="16"
        height="16"
      >
        <path
          fillRule="evenodd"
          d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"
        ></path>
      </svg>
    </div>
  );
}

export function ExpandingChevronLeft({ className }: { className?: string }) {
  return (
    <div className="group relative flex items-center">
      {/* Static chevron */}
      <svg
        className={cn(
          "absolute h-4 w-4 transition-all group-hover:-translate-x-1 group-hover:opacity-0",
          className,
        )}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>

      {/* Animated chevron with line */}
      <svg
        className={cn(
          "absolute h-4 w-4 opacity-0 transition-all group-hover:-translate-x-1 group-hover:opacity-100",
          className,
        )}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
        <line x1="21" y1="12" x2="15" y2="12" />
      </svg>
    </div>
  );
}
