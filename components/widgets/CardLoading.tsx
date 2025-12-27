export const CardLoading = () => {
  return (
    <div className="relative overflow-hidden rounded-xl p-4 shadow-sm">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-muted/20 to-transparent" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-5 w-24 rounded bg-muted/40" />
            <div className="h-4 w-32 rounded bg-muted/40" />
          </div>
          <div className="h-8 w-8 bg-muted/40" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="h-10 w-full rounded-lg bg-muted/40" />
          <div className="h-4 w-1/3 rounded bg-muted/40" />
        </div>

        {/* Footer */}
        <div className="space-y-2 mt-auto pt-2 border-t">
          <div className="h-4 w-1/2 rounded bg-muted/40" />
          <div className="h-4 w-1/3 rounded bg-muted/40" />
        </div>
      </div>
    </div>
  );
};
