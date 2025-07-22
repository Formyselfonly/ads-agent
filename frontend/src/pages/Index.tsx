import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { AgentDecisionTree } from "@/components/agent/AgentDecisionTree";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardOverview />;
      case "campaigns":
        return <CampaignList />;
      case "agent":
        return <AgentDecisionTree />;
      case "settings":
        return (
          <div className="p-6 bg-background min-h-screen">
            <h1 className="text-2xl font-bold text-foreground">系统设置</h1>
            <p className="text-muted-foreground">配置AI Agent和系统参数</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderCurrentPage()}
    </div>
  );
};

export default Index;
