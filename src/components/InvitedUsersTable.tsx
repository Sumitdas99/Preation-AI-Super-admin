import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function InvitedUsersTable({
  invitedUsers,
  getRoleBadge,
  formatDateOnly,
}: any) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Work Email</TableHead>
            <TableHead>Brand Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Invited On</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitedUsers.map((invite: any) => {
            const fullName = invite.first_name && invite.last_name
              ? `${invite.first_name} ${invite.last_name}`
              : invite.first_name || invite.last_name || "—";
            return (
              <TableRow key={invite.invite_id || invite.email}>
                <TableCell className="font-medium">{fullName}</TableCell>
                <TableCell>{invite.email}</TableCell>
                <TableCell>{invite.brand_name || "—"}</TableCell>
                <TableCell>{getRoleBadge(invite.role)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDateOnly(invite.created_at)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pending
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
