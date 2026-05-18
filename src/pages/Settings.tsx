import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastSuccess, toastError } from "@/utils/toast";
import { Edit, Save, X } from "lucide-react";
import { getProfile, updateProfile } from "@/api/auth";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "@/context/slice/authSlice";

export default function Settings() {
  const [profile, setProfile] = useState({ email: "", firstName: "", lastName: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await getProfile();
      setProfile({
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
      });
    } catch (error: any) {
      toastError(error.message || "Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await updateProfile({ firstName: profile.firstName, lastName: profile.lastName });
      dispatch(updateUserProfile({ firstName: profile.firstName, lastName: profile.lastName }));
      setIsEditing(false);
      toastSuccess("Your profile has been updated successfully.", "Profile Updated");
    } catch (error: any) {
      toastError(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline" size="sm" disabled={isLoading}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} size="sm" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {profileLoading ? (
            <div className="flex justify-center py-8 text-muted-foreground">Loading profile...</div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
