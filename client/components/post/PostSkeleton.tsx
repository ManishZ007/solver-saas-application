export default function PostSkeleton() {
  return (
    <div className="border rounded-2xl p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-muted" />
        <div className="h-3 w-24 bg-muted rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-14 bg-muted rounded-full" />
        <div className="h-5 w-20 bg-muted rounded-full" />
      </div>
      <div className="h-5 w-2/3 bg-muted rounded" />
      <div className="w-full h-48 bg-muted rounded-lg" />
      <div className="h-3 w-full bg-muted rounded" />
      <div className="h-3 w-4/5 bg-muted rounded" />
      <div className="h-9 w-full bg-muted rounded-lg" />
    </div>
  );
}
