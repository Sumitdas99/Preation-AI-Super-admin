import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastSuccess, toastError } from "@/utils/toast";
import { adminApi } from "@/api/admin";
import { Loader2, UserPlus } from "lucide-react";
import { validateEmailDomainNotPublic } from "@/lib/emailValidation";

const ADD_USER_ROLES = [
  { name: "Content Reviewer", value: "CONTENT_REVIEWER" },
  { name: "Legal Approver", value: "LEGAL_APPROVER" },
];

function generateTempPassword(length = 12) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + digits + symbols;
  const pick = (str: string) => str.charAt(Math.floor(Math.random() * str.length));
  let s = pick(upper) + pick(lower) + pick(digits) + pick(symbols);
  for (let i = s.length; i < length; i++) s += pick(all);
  return s.split("").sort(() => Math.random() - 0.5).join("");
}

interface AddUserToBrandDialogProps {
  brandsList: { brand_id: string; brand_name: string }[];
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  /** Controlled open (e.g. when opened from row "Add user to this brand") */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Pre-select this brand (e.g. from row context) */
  initialBrandId?: string | null;
  initialBrandName?: string | null;
}

export function AddUserToBrandDialog({
  brandsList,
  onSuccess,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialBrandId,
  initialBrandName,
}: AddUserToBrandDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  const [brandId, setBrandId] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const useInitialBrand = Boolean(initialBrandId);

  useEffect(() => {
    if (open && initialBrandId) {
      setBrandId(typeof initialBrandId === "string" ? initialBrandId : String(initialBrandId));
    }
    if (!open) {
      setInviteLink(null);
      setGeneratedPassword(null);
      if (!initialBrandId) setBrandId("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setRole("");
      setEmailError(null);
    }
  }, [open, initialBrandId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId || !email.trim() || !firstName.trim() || !lastName.trim() || !role) {
      toastError("Please fill in all required fields (Brand, Email, First Name, Last Name, and Role)");
      return;
    }
    
    // Validate email domain
    const emailValidation = validateEmailDomainNotPublic(email.trim());
    if (!emailValidation.isValid) {
      toastError(emailValidation.error, "Invalid Email Domain");
      return;
    }
    const password = generateTempPassword(12);
    setLoading(true);
    try {
      const response = await adminApi.inviteUserAsSuperAdmin({
        brand_id: brandId,
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role,
        temp_password: password,
      });
      const token = response?.token ?? response?.data?.token;
      setInviteLink(token ? `${window.location.origin}/invitations/accept?token=${token}` : null);
      setGeneratedPassword(password);
      toastSuccess(`User created. ${email.trim()} will receive an email with their login details (invite link and temporary password).`, "User Created & Invite Sent");
      onSuccess?.();
    } catch (err: any) {
      toastError(err.response?.data?.detail || err.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setInviteLink(null);
      setGeneratedPassword(null);
      setBrandId("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setRole("");
    }
    setOpen(nextOpen);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <UserPlus className="h-4 w-4 mr-2" />
      Add user to brand
    </Button>
  );

  const isControlled = controlledOpen !== undefined;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {!isControlled && <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Creation & Invite</DialogTitle>
          {/* <DialogDescription>
            Invite a user to an existing brand with a role. A temporary password will be generated; share it with the invite link. Same flow as invitation link.
          </DialogDescription> */}
        </DialogHeader>
        {(inviteLink || generatedPassword) ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              User created. {email.trim()} will receive an email with their login details (invite link and temporary password).
            </p>
            <DialogFooter>
              <Button onClick={() => handleClose(false)}>Close</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Brand</Label>
              {useInitialBrand ? (
                <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm">
                  {initialBrandName || "—"}
                </div>
              ) : (
                <Select value={brandId} onValueChange={setBrandId} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandsList.map((b) => (
                      <SelectItem key={b.brand_id} value={b.brand_id}>
                        {b.brand_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-user-email">Email</Label>
              <Input
                id="add-user-email"
                type="email"
                placeholder="user@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null); // Clear error when user types
                }}
                onBlur={(e) => {
                  if (e.target.value && e.target.value.includes("@")) {
                    const validation = validateEmailDomainNotPublic(e.target.value);
                    if (!validation.isValid) {
                      setEmailError(validation.error);
                    } else {
                      setEmailError(null);
                    }
                  }
                }}
                disabled={loading}
                className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {emailError && (
                <p className="text-sm text-destructive mt-1">{emailError}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-user-first-name">First Name</Label>
                <Input
                  id="add-user-first-name"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-user-last-name">Last Name</Label>
                <Input
                  id="add-user-last-name"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ADD_USER_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                A temporary password will be generated automatically.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !brandId || !email.trim() || !firstName.trim() || !lastName.trim() || !role}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send invitation"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
