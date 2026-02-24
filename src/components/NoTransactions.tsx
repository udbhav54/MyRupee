export default function NoTransactions() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-64 h-64 mb-8 opacity-50">
        <svg
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="256" cy="256" r="200" fill="currentColor" opacity="0.1" />
          <path
            d="M256 128v256M128 256h256"
            stroke="currentColor"
            strokeWidth="32"
            strokeLinecap="round"
            opacity="0.3"
          />
          <circle cx="256" cy="256" r="80" fill="currentColor" opacity="0.2" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold mb-2">
        You Have No Transactions Currently
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        Start by adding your first income or expense transaction using the
        buttons above.
      </p>
    </div>
  );
}
