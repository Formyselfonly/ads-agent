import { Brain, BarChart3, Zap, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: '仪表盘', icon: BarChart3 },
  { id: 'campaigns', label: '广告活动', icon: Zap },
  { id: 'agent', label: 'AI 决策', icon: Brain },
  { id: 'settings', label: '设置', icon: Settings },
];

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AdAgent Pro</h1>
              <p className="text-xs text-muted-foreground">智能广告管理系统</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "h-9 px-4 text-sm transition-all duration-200",
                  currentPage === item.id 
                    ? "bg-gradient-primary text-white shadow-soft" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs"
              />
            </Button>
            <div className="w-8 h-8 bg-gradient-accent rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}