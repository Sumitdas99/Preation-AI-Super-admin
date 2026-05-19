import {
  Building2,
  Users,
  CreditCard,
  Activity,
  TrendingUp,
  AlertCircle,
  Bell,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminApi } from "@/api/admin";
import { CreateBrandAdminDialog } from "@/components/CreateBrandAdminDialog";

const metrics = [
  {
    title: "Active Brands",
    value: "247",
    change: "+12%",
    icon: Building2,
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Total Users",
    value: "3,482",
    change: "+8%",
    icon: Users,
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    title: "Monthly Revenue",
    value: "$127.5K",
    change: "+23%",
    icon: CreditCard,
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    title: "API Requests",
    value: "12.4M",
    change: "+15%",
    icon: Activity,
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
];

const topBrands = [
  { name: "Acme Corp", users: 145, usage: 87, plan: "Enterprise", health: "healthy" },
  { name: "TechStart Inc", users: 89, usage: 92, plan: "Business", health: "warning" },
  { name: "Creative Agency", users: 67, usage: 45, plan: "Business", health: "healthy" },
  { name: "MediaCo", users: 234, usage: 98, plan: "Enterprise", health: "critical" },
  { name: "BrandWorks", users: 52, usage: 34, plan: "Pro", health: "healthy" },
];

const systemAlerts = [
  {
    id: "1",
    type: "high_overrides",
    severity: "warning",
    brand: "MediaCo",
    asset: "campaign_video_2024.mp4",
    description: "Asset has 4 policy overrides",
    syntheticConfidence: 78,
    approvedBy: "Sarah Approver",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "high_synthetic",
    severity: "critical",
    brand: "TechStart Inc",
    asset: "product_launch.mp4",
    description: "92% synthetic confidence but approved",
    syntheticConfidence: 92,
    approvedBy: "John Approver",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    type: "high_overrides",
    severity: "warning",
    brand: "Acme Corp",
    asset: "social_ad_v3.png",
    description: "Asset has 5 policy overrides",
    syntheticConfidence: 65,
    approvedBy: "Alice Approver",
    timestamp: "1 day ago",
  },
];

export default function SuperAdmin() {
  return (
    <div className="space-y-4 p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Super Admin Console</h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Platform-wide monitoring and workspace management
          </p>
        </div>
        {/* <CreateBrandAdminDialog defaultTrigger /> */}
      </div>

      {/* Platform Metrics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className={cn("card-shadow relative overflow-hidden border-none bg-gradient-to-br", metric.gradient)}>
            <div className={cn("absolute -right-6 -top-6 h-32 w-32 rounded-full blur-3xl", metric.iconBg.replace('/10', '/30'))} />
            
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-sm", metric.iconBg)}>
                <metric.icon className={cn("h-5 w-5", metric.iconColor)} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold font-display">{metric.value}</div>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="font-medium text-success">{metric.change}</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Workspaces */}
      <Card className="card-shadow border-none bg-gradient-to-br from-blue-500/5 via-card to-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-display">Top Brands</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Highest usage and activity in the last 30 days
              </p>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topBrands.map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-light hidden sm:flex">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light sm:hidden">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-semibold text-sm sm:text-base">{brand.name}</p>
                    <Badge variant="outline">{brand.plan}</Badge>
                    {brand.health === "critical" && (
                      <Badge variant="outline" className="status-block">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Critical
                      </Badge>
                    )}
                    {brand.health === "warning" && (
                      <Badge variant="outline" className="status-flag">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Warning
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <span>{brand.users} users</span>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-2">
                      <Progress value={brand.usage} className="h-2 w-16 sm:w-24" />
                      <span>{brand.usage}% usage</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0">
                  Manage
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card className="card-shadow overflow-hidden border-none bg-gradient-to-br from-amber-500/5 via-card to-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl font-display flex items-center gap-2">
                <Bell className="h-5 w-5 text-warning" />
                System Alerts
              </CardTitle>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Anomaly detection and risk assessment alerts
              </p>
            </div>
            <Badge variant="outline" className="status-warning w-fit">
              {systemAlerts.length} Active Alerts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Synthetic %</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    <Badge
                      variant={alert.severity === "critical" ? "destructive" : "outline-solid"}
                      className={alert.severity === "critical" ? "status-block" : "status-flag"}
                    >
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{alert.brand}</TableCell>
                  <TableCell className="text-sm">{alert.asset}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {alert.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{alert.syntheticConfidence}%</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{alert.approvedBy}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {alert.timestamp}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Notify Admin
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="card-shadow border-none bg-gradient-to-br from-emerald-500/5 via-card to-card">
          <CardHeader>
            <CardTitle className="font-display">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>API Uptime</span>
                <span className="font-medium text-success">99.97%</span>
              </div>
              <Progress value={99.97} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Detection Service</span>
                <span className="font-medium text-success">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Database Performance</span>
                <span className="font-medium text-success">98.5%</span>
              </div>
              <Progress value={98.5} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Storage Capacity</span>
                <span className="font-medium text-warning">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-gradient-to-br from-purple-500/5 via-card to-card">
          <CardHeader>
            <CardTitle className="font-display">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New brand created", brand: "DesignStudio", time: "5m ago" },
                { action: "Plan upgraded to Enterprise", brand: "Acme Corp", time: "1h ago" },
                { action: "Support ticket escalated", brand: "MediaCo", time: "2h ago" },
                { action: "User limit reached", brand: "TechStart Inc", time: "3h ago" },
                { action: "Payment method updated", brand: "BrandWorks", time: "5h ago" },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-muted-foreground">{activity.brand}</p>
                  </div>
                  <span className="text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
