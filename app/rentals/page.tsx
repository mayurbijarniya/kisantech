"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Wrench, Calendar, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

interface Equipment {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  quantity: number;
  shipping: boolean;
  slug: string;
  rentalType?: "daily" | "weekly" | "monthly";
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function RentalsPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEquipment();
    getAllCategories();
  }, []);

  useEffect(() => {
    filterEquipment();
  }, [searchTerm, selectedCategory, sortBy, equipment]);

  const getAllEquipment = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/product/get-product");
      if (data?.success) {
        // Filter products that could be rental equipment (you might want to add a rental flag to products)
        const rentalEquipment = data.products.map((product: any) => ({
          ...product,
          rentalType: "daily" as const
        }));
        setEquipment(rentalEquipment);
        setFilteredEquipment(rentalEquipment);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching equipment");
    } finally {
      setLoading(false);
    }
  };

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filterEquipment = () => {
    let filtered = equipment;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category._id === selectedCategory);
    }

    // Sort equipment
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredEquipment(filtered);
  };

  const rentEquipment = (item: Equipment) => {
    toast.success(`Rental request sent for ${item.name}`);
    // Here you would typically handle the rental logic
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded mb-4" />
                    <div className="h-6 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Equipment Rental</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rent agricultural equipment and tools from fellow farmers
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Grid */}
          {filteredEquipment.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {equipment.length === 0 ? "No equipment available" : "No equipment found"}
              </h3>
              <p className="text-muted-foreground">
                {equipment.length === 0 
                  ? "Sellers haven't added any equipment for rent yet. Check back later!" 
                  : "Try adjusting your search or filters"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEquipment.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={`/api/product/product-photo/${item._id}`}
                        alt={item.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEzMEg3MEwxMDAgNzBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";
                        }}
                      />
                      <Badge className="absolute top-2 right-2 bg-blue-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.rentalType}
                      </Badge>
                      {item.quantity < 5 && item.quantity > 0 && (
                        <Badge variant="destructive" className="absolute top-2 left-2">
                          Limited
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">
                            {item.category?.name}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-primary">
                              ₹{item.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">/{item.rentalType}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Available: {item.quantity}
                          </span>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => rentEquipment(item)}
                          disabled={item.quantity === 0}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          {item.quantity === 0 ? "Not Available" : "Rent Now"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}