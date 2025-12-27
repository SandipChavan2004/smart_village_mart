import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { User, Store, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/api";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const isShopkeeper = user?.role === "shopkeeper";
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    shop_name: user?.shop_name || "",
    category: user?.category || "",
    gstin: user?.gstin || "",
    pan: user?.pan || "",
    license_number: "",
  });

  // Sync form data with user data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        shop_name: user.shop_name || "",
        category: user.category || "",
        gstin: user.gstin || "",
        pan: user.pan || "",
        license_number: "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset form data to user data
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        shop_name: user.shop_name || "",
        category: user.category || "",
        gstin: user.gstin || "",
        pan: user.pan || "",
        license_number: "",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const endpoint = isShopkeeper
        ? `/shopkeeper/profile/${user.id}`
        : `/customer/profile/${user.id}`;

      const res = await api.put(endpoint, formData);

      // Update user in context and localStorage
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">

        {/* PROFILE SUMMARY (VIEW MODE) */}
        <Card className="shadow-sm">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
              {isShopkeeper ? (
                <Store className="h-10 w-10 text-emerald-600" />
              ) : (
                <User className="h-10 w-10 text-emerald-600" />
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {user?.name}
              </h2>

              <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {user?.phone || "Not added"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user?.address || "Not added"}
                </span>
              </div>

              <Badge className="mt-3 capitalize">
                {user?.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* EDIT SECTION */}
        <Card className="shadow-md">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Details</CardTitle>
                <p className="text-sm text-gray-500">
                  {editMode ? "Update your information below" : "View your profile information"}
                </p>
              </div>
              {!editMode && (
                <Button onClick={handleEdit} variant="outline">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleSave} className="space-y-10">

              {/* BASIC INFO */}
              <section>
                <h3 className="text-lg font-medium mb-4">
                  Basic Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Name</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input value={user?.email} disabled />
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      disabled={!editMode}
                    />
                  </div>

                  <div>
                    <Label>Address</Label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </section>

              {/* SHOPKEEPER INFO */}
              {isShopkeeper && (
                <section>
                  <h3 className="text-lg font-medium mb-4">
                    Shop Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>Shop Name</Label>
                      <Input
                        name="shop_name"
                        value={formData.shop_name}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div>
                      <Label>Category</Label>
                      <Input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div>
                      <Label>GSTIN</Label>
                      <Input
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div>
                      <Label>PAN</Label>
                      <Input
                        name="pan"
                        value={formData.pan}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* SAVE/CANCEL */}
              {editMode && (
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button size="lg" className="px-10" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

      </div>

      <Footer />
    </div>
  );
}