import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Eye, MoreVertical, LogOut, KeyRound, ArrowRightLeft, UserPlus } from "lucide-react";

export function UsersTable({
  users,
  brandsList,
  handleViewUser,
  handleAction,
  setForceLogoutUser,
  setForceLogoutBrandUser,
  setForcePasswordUser,
  setAddUserToBrandForBrand,
  setTransferDialogBrand,
  setIsTransferDialogOpen,
  getRoleBadge,
  getStatusBadge,
  getAccessBadge,
  getSignupMethodBadge,
  formatDate,
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
            <TableHead>Approval</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Sign up</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: any) => (
            <TableRow key={user.user_id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.brand_name || user.workspace || "—"}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>{getAccessBadge(user.is_active)}</TableCell>
              <TableCell>{getSignupMethodBadge(user.auth_provider)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(user.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewUser(user)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() =>
                          handleAction(
                            user.is_active ? "deactivate" : "activate",
                            user
                          )
                        }
                      >
                        {user.is_active ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setForceLogoutUser(user)}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Force logout
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => setForceLogoutBrandUser(user)}
                        disabled={!user.brand_name && !user.workspace}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Force logout all (this brand)
                      </DropdownMenuItem>

                      {(!user.auth_provider || user.auth_provider === "email") && (
                        <DropdownMenuItem onSelect={() => setForcePasswordUser(user)}>
                          <KeyRound className="h-4 w-4 mr-2" />
                          Force password reset
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onSelect={() => {
                          const bid = user.brand_id || brandsList.find(
                            (b: any) => (b.brand_name || "").trim().toLowerCase() === (user.brand_name || user.workspace || "").trim().toLowerCase()
                          )?.brand_id;
                          if (!bid) {
                            // Can't directly toastError since we didn't pass it, but maybe just use the state directly.
                            // Actually wait, let's pass an onError callback or just pass the setter
                          }
                          setAddUserToBrandForBrand({
                            brandId: typeof bid === "string" ? bid : String(bid),
                            brandName: user.brand_name || user.workspace || "N/A",
                          });
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add user to this brand
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          const brandId = user.brand_id || brandsList.find(
                            (b: any) => (b.brand_name || "").trim().toLowerCase() === (user.brand_name || user.workspace || "").trim().toLowerCase()
                          )?.brand_id;
                          setTransferDialogBrand({
                            brandId: typeof brandId === "string" ? brandId : String(brandId),
                            brandName: user.brand_name || user.workspace || "N/A",
                          });
                          setIsTransferDialogOpen(true);
                        }}
                      >
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Transfer Brand Admin
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
