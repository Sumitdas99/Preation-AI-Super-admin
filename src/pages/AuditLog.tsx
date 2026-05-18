import { useState } from "react";
import { FileSearch, Search, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const auditEvents = [
  { id: "audit_001", timestamp: "2024-10-20 14:30:45", user: "Sarah Approver", action: "Asset Approved", assetId: "ast_123", assetName: "spring-campaign-bars.mp4", details: "Approved with attestation: Contains synthetic scenes - properly disclosed", ipAddress: "203.0.113.42" },
  { id: "audit_002", timestamp: "2024-10-20 14:25:12", user: "John Reviewer", action: "Asset Uploaded", assetId: "ast_123", assetName: "spring-campaign-bars.mp4", details: "Uploaded via web interface", ipAddress: "203.0.113.15" },
  { id: "audit_003", timestamp: "2024-10-20 14:20:30", user: "System", action: "Pre-Flight Scan Completed", assetId: "ast_123", assetName: "spring-campaign-bars.mp4", details: "Synthetic: 85%, Violations: 2", ipAddress: "System" },
  { id: "audit_004", timestamp: "2024-10-20 13:15:22", user: "Mike Admin", action: "Policy Updated", assetId: "-", assetName: "-", details: "Synthetic threshold changed from 80% to 85%", ipAddress: "203.0.113.10" },
  { id: "audit_005", timestamp: "2024-10-20 12:45:18", user: "Alice Chen", action: "Asset Rejected", assetId: "ast_456", assetName: "product-launch-ad.jpg", details: "Rejected: Missing AI disclosure", ipAddress: "203.0.113.25" },
];

const actionTypes = ["All Actions", "Asset Uploaded", "Asset Approved", "Asset Rejected", "Policy Updated", "Pre-Flight Scan Completed", "User Added", "User Removed"];

export default function AuditLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("All Actions");

  const filteredEvents = auditEvents.filter((event) => {
    const matchesSearch =
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === "All Actions" || event.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-4 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Audit Log</h1>
          <p className="mt-1 text-muted-foreground">Immutable record of all system actions and events</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Log
        </Button>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-display">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user, asset, or action..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map((action) => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-display">Audit Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {event.timestamp}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{event.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.action}</Badge>
                  </TableCell>
                  <TableCell>
                    {event.assetId !== "-" ? (
                      <div>
                        <p className="font-medium">{event.assetName}</p>
                        <p className="text-xs text-muted-foreground">{event.assetId}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-md text-sm text-muted-foreground">{event.details}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{event.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-primary bg-primary-light/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileSearch className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-medium">About Audit Logs</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                All audit logs are stored in WORM (Write Once Read Many) storage and cannot be modified or deleted. This ensures complete traceability for regulatory compliance and legal audits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
