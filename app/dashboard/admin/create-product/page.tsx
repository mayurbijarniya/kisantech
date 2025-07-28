"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth";

export default function CreateProduct() {
  const router = useRouter();
  const { auth, isHydrated } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: [] as string[],
    salePrice: "",
    rentalPrice: "",
    rentalUnit: "per day",
    rentalFrom: "",
    rentalTo: "",
    category: "",
    quantity: "",
    shipping: "0",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    // Wait for auth to be hydrated
    if (!isHydrated) {
      return;
    }
    
    // If no user after hydration, redirect to login
    if (!auth.user) {
      toast.error("Please login to access this page");
      router.push("/login");
      return;
    }
    
    // Check if user has permission (seller or admin)
    if (auth.user.role !== 1 && auth.user.role !== 2) {
      toast.error("Access denied. Seller or Admin only.");
      router.push("/");
      return;
    }
    getAllCategories();
  }, [auth.user, isHydrated, router]);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching categories");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.type.length === 0) {
      toast.error(
        "Please select at least one availability option (Sale or Rent)"
      );
      return;
    }

    if (formData.type.includes("sell") && !formData.salePrice) {
      toast.error("Sale price is required when product is available for sale");
      return;
    }

    if (
      formData.type.includes("rent") &&
      (!formData.rentalPrice || !formData.rentalFrom || !formData.rentalTo)
    ) {
      toast.error(
        "Rental price and availability dates are required when product is available for rent"
      );
      return;
    }

    try {
      setLoading(true);

      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("type", JSON.stringify(formData.type));

      if (formData.type.includes("sell")) {
        productData.append("salePrice", formData.salePrice);
      }

      if (formData.type.includes("rent")) {
        productData.append("rentalPrice", formData.rentalPrice);
        productData.append("rentalUnit", formData.rentalUnit);
        productData.append("rentalFrom", formData.rentalFrom);
        productData.append("rentalTo", formData.rentalTo);
      }

      productData.append("quantity", formData.quantity);
      productData.append("category", formData.category);
      productData.append("shipping", formData.shipping);
      if (photo) {
        productData.append("photo", photo);
      }

      const { data } = await axios.post(
        "/api/product/create-product",
        productData
      );

      if (data?.success) {
        toast.success("Product created successfully");
        router.push("/dashboard/admin");
      } else {
        toast.error(data?.message || "Error creating product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth is being hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />
        <main className="pt-20 pb-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />

      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/dashboard/admin">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Add New Product
            </h1>
            <p className="text-gray-600">
              Create a new product listing for your store
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Details
              </CardTitle>
              <CardDescription>
                Fill in the information below to create your product listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>

                {/* Product Type Selection */}
                <div className="space-y-4">
                  <Label>Product Availability *</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.type.includes("sell")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              type: [...formData.type, "sell"],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              type: formData.type.filter((t) => t !== "sell"),
                            });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span>Available for Sale</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.type.includes("rent")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              type: [...formData.type, "rent"],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              type: formData.type.filter((t) => t !== "rent"),
                            });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span>Available for Rent</span>
                    </label>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  {formData.type.includes("sell") && (
                    <div className="space-y-2">
                      <Label htmlFor="salePrice">Sale Price (₹) *</Label>
                      <Input
                        id="salePrice"
                        name="salePrice"
                        type="number"
                        placeholder="0"
                        value={formData.salePrice}
                        onChange={handleChange}
                        required={formData.type.includes("sell")}
                      />
                    </div>
                  )}

                  {formData.type.includes("rent") && (
                    <div className="space-y-2">
                      <Label htmlFor="rentalPrice">Rental Price (₹) *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="rentalPrice"
                          name="rentalPrice"
                          type="number"
                          placeholder="0"
                          value={formData.rentalPrice}
                          onChange={handleChange}
                          required={formData.type.includes("rent")}
                          className="flex-1"
                        />
                        <Select
                          value={formData.rentalUnit}
                          onValueChange={(value) =>
                            setFormData({ ...formData, rentalUnit: value })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="per day">Per Day</SelectItem>
                            <SelectItem value="per week">Per Week</SelectItem>
                            <SelectItem value="per month">Per Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rental Availability */}
                {formData.type.includes("rent") && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rentalFrom">Available From *</Label>
                      <Input
                        id="rentalFrom"
                        name="rentalFrom"
                        type="date"
                        value={formData.rentalFrom}
                        onChange={handleChange}
                        required={formData.type.includes("rent")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rentalTo">Available Until *</Label>
                      <Input
                        id="rentalTo"
                        name="rentalTo"
                        type="date"
                        value={formData.rentalTo}
                        onChange={handleChange}
                        required={formData.type.includes("rent")}
                      />
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shipping">Shipping Available</Label>
                    <Select
                      value={formData.shipping}
                      onValueChange={(value) =>
                        setFormData({ ...formData, shipping: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Product Photo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label htmlFor="photo" className="cursor-pointer">
                      {photoPreview ? (
                        <div className="space-y-4">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <p className="text-sm text-gray-600">
                            Click to change photo
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div>
                            <p className="text-lg font-medium text-gray-900">
                              Upload Product Photo
                            </p>
                            <p className="text-sm text-gray-600">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Creating..." : "Create Product"}
                  </Button>
                  <Link href="/dashboard/admin">
                    <Button type="button" variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
