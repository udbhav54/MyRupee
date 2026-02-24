export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping"></div>
        <div className="absolute inset-0 border-4 border-primary rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
