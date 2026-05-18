import { FileText, CheckCircle2, AlertTriangle, Clock, TrendingUp, TrendingDown, FileVideo, FileImage } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreateBrandAdminDialog } from "@/components/CreateBrandAdminDialog";

const kpis = [
  {
    title: "Content Credentials",
    value: "87%",
    change: "+5.2%",
    trend: "up",
    icon: FileText,
    status: "success" as const,
  },
  {
    title: "AI Disclosures",
    value: "92%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle2,
    status: "success" as const,
  },
  {
    title: "Open Violations",
    value: "23",
    change: "-8",
    trend: "down",
    icon: AlertTriangle,
    status: "warning" as const,
  },
  {
    title: "Avg Approval Time",
    value: "4.2h",
    change: "-0.5h",
    trend: "down",
    icon: Clock,
    status: "success" as const,
  },
];

const recentAssets = [
  {
    id: "1",
    name: "campaign_hero_2024.mp4",
    status: "pass",
    synthetic: 98,
    suitability: "Compliant",
    c2pa: true,
    timestamp: "2 mins ago",
    thumbnail: <FileVideo className="h-5 w-5" />,
  },
  {
    id: "2",
    name: "product_showcase.jpg",
    status: "flag",
    synthetic: 76,
    suitability: "Review Required",
    c2pa: false,
    timestamp: "15 mins ago",
    thumbnail: <FileImage className="h-5 w-5" />,
  },
  {
    id: "3",
    name: "social_ad_v3.png",
    status: "processing",
    synthetic: null,
    suitability: "Processing...",
    c2pa: null,
    timestamp: "Just now",
    thumbnail: <FileImage className="h-5 w-5" />,
  },
  {
    id: "4",
    name: "testimonial_video.mp4",
    status: "pass",
    synthetic: 15,
    suitability: "Compliant",
    c2pa: true,
    timestamp: "1 hour ago",
    thumbnail: <FileVideo className="h-5 w-5" />,
  },
  {
    id: "5",
    name: "brand_banner.png",
    status: "block",
    synthetic: 95,
    suitability: "Non-Compliant",
    c2pa: false,
    timestamp: "2 hours ago",
    thumbnail: <FileImage className="h-5 w-5" />,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-[14px]">
            Platform-wide monitoring and analytics
          </p>
        </div>
        {/* <div className="flex gap-3">
          <CreateBrandAdminDialog defaultTrigger />
        </div> */}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <Card
            key={kpi.title}
            className={`kPI relative overflow-hidden rounded-2xl hover:card-shadow-lg transition-all duration-300
    ${i === 0
              ? "kpi-gradient-blue"
              : i === 1
                ? "kpi-gradient-green"
                : i === 2
                  ? "kpi-gradient-cyan"
                  : "kpi-gradient-purple"
            }
  `}
          >
            <span className="kpi-circle kpi-circle-lg" />
            <span className="kpi-circle kpi-circle-sm" />

            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2 pt-2 px-4">
              <CardTitle className="text-sm font-medium text-white/90">
                {kpi.title}
              </CardTitle>
              <div
                className={`kpi-icon-hover flex h-11 w-11 items-center justify-center rounded-full
    bg-white/15 backdrop-blur-sm
        `}
              >
                <kpi.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>

            <CardContent className="relative z-10 px-6 pb-3 pt-0">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-semibold font-display text-white">
                    {kpi.value}
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium
              ${kpi.trend === "up"
                            ? "bg-success/20 text-success"
                            : "bg-danger/20 text-danger"
                          }
            `}
                    >
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {kpi.change}
                    </span>
                    <span className="text-white/70">vs last month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Overview - same table as Admin Dashboard */}
      <Card className="">
        <CardHeader className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-display">
                System Overview
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Cross-brand analytics and metrics
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/violations")}
              className="font-semibold text-[#073c92] underline"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Asset
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Synthetic
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                    C2PA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Suitability
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="group relative
  border-b border-border last:border-b-0
  transition-all duration-300 ease-out
  hover:shadow-sm"
                  >
                    <td className="px-4 py-4">
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          {asset.thumbnail}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">
                              {asset.name}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {asset.timestamp}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={`
                      text-xs font-medium
                      ${asset.status === "pass"
                            ? "border-green-300 bg-green-50 text-green-700"
                            : asset.status === "flag"
                              ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                              : asset.status === "block"
                                ? "border-red-300 bg-red-50 text-red-700"
                                : "border-slate-300 bg-slate-50 text-slate-600"
                          }
                    `}
                      >
                        {asset.status === "pass"
                          ? "Pass"
                          : asset.status === "flag"
                            ? "Review"
                            : asset.status === "block"
                              ? "Block"
                              : "Processing"}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        {asset.synthetic !== null ? (
                          <div className="flex items-center gap-2">
                            <Progress value={asset.synthetic} className="h-2 w-20" />
                            <span className="text-xs font-medium text-muted-foreground">
                              {asset.synthetic}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 align-middle text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium">
                          {asset.c2pa === null ? "-" : asset.c2pa ? "✓" : "✗"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-middle text-left">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          {asset.suitability}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/violations")}
                        className="
                  opacity-0 group-hover:opacity-100
                  transition-opacity
                  text-primary font-medium
                  border border-primary/30
                  hover:bg-primary/10
                "
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
