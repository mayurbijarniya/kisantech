"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Edit, Trash2, Tag } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateCategory() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllCategories();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/category/create-category", { name });
      if (data?.success) {
        toast.success(`${name} category created successfully`);
        setName("");
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating category");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/category/update-category/${editingCategory._id}`,
        { name: editName }
      );
      if (data?.success) {
        toast.success(`${editName} updated successfully`);
        setEditingCategory(null);
        setEditName("");
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}" category?`)) {
      try {
        const { data } = await axios.delete(`/api/category/delete-category/${id}`);
        if (data?.success) {
          toast.success("Category deleted successfully");
          getAllCategories();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error deleting category");
      }
    }
  };

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
              Manage Categories
            </h1>
            <p className="text-gray-600">
              Create and manage product categories for your store
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Create Category Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingCategory ? "Edit Category" : "Create New Category"}
                </CardTitle>
                <CardDescription>
                  {editingCategory ? "Update the category name" : "Add a new category to organize your products"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingCategory ? handleUpdate : handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      placeholder="Enter category name"
                      value={editingCategory ? editName : name}
                      onChange={(e) => editingCategory ? setEditName(e.target.value) : setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Processing..." : (editingCategory ? "Update Category" : "Create Category")}
                    </Button>
                    {editingCategory && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditingCategory(null);
                          setEditName("");
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Categories List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Existing Categories ({categories.length})
                </CardTitle>
                <CardDescription>
                  Manage your existing product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-8">
                    <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                    <p className="text-gray-600">Create your first category to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Tag className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category);
                              setEditName(category.name);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(category._id, category.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}