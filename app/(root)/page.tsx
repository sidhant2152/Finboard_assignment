import { DashboardGrid } from "@/components/layout/Dashboard";

export default function Home() {
  return (
    <div className="min-h-[calc(screen-89px)] bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-[1920px] mx-auto">
        <DashboardGrid />
      </div>
    </div>
  );
}
