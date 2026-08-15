export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-purple-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 3h15" />
              <path d="M6 3v16a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V3" />
              <path d="M6 14h12" />
            </svg>
          </div>
          <div className="absolute -inset-2 animate-pulse rounded-2xl bg-accent/20 blur-lg" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
