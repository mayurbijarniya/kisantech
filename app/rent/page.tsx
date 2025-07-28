"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Clock, Tractor, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

interface RentalProduct {
  _id: string;
  name: string;
  rentalPrice: number;
  rentalUnit: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  quantity: number;
  shipping: boolean;
  slug: string;
  type: string[];
  availabilityStatus: string;
  rentalAvailability: {
    from: Date;
    to: Date;
  };
  photo?: {
    data: Buffer;
    contentType: string;
  };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function RentPage() {
  const [products, setProducts] = useState<RentalProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<RentalProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRentalProducts();
    getAllCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy]);

  const getAllRentalProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/get-product");
      if (data?.success) {
        // Filter only products available for rent
        const rentalProducts = data.products.filter((product: RentalProduct) => 
          product.type.includes('rent') && product.availabilityStatus === 'available'
        );
        setProducts(rentalProducts);
        setFilteredProducts(rentalProducts);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching rental products");
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

  const filterProducts = () => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category._id === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.rentalPrice - b.rentalPrice;
        case "price-high":
          return b.rentalPrice - a.rentalPrice;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleRentNow = (product: RentalProduct) => {
    // Navigate to rental booking page
    window.location.href = `/rent/${product._id}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-6 bg-muted rounded w-1/3" />
                    </div>
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
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Rent Agricultural Equipment</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rent high-quality agricultural equipment and tools. Perfect for seasonal needs, short-term projects, or trying before buying.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
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

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Tractor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {products.length === 0 ? "No equipment available for rent" : "No equipment found"}
              </h3>
              <p className="text-muted-foreground">
                {products.length === 0 
                  ? "Equipment owners haven't listed any items for rent yet. Check back later!" 
                  : "Try adjusting your search or filters"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={`/api/product/product-photo/${product._id}`}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEzMEg3MEwxMDAgNzBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";
                        }}
                      />
                      {product.shipping && (
                        <Badge className="absolute top-2 right-2 bg-green-600">
                          <Wrench className="h-3 w-3 mr-1" />
                          Delivery
                        </Badge>
                      )}
                      {product.quantity < 5 && product.quantity > 0 && (
                        <Badge variant="destructive" className="absolute top-2 left-2">
                          Limited Stock
                        </Badge>
                      )}
                      <Badge className="absolute bottom-2 left-2 bg-orange-600">
                        For Rent
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">
                            {product.category?.name}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-orange-600">
                              ₹{product.rentalPrice.toLocaleString()} {product.rentalUnit}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Available: {product.quantity}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDate(product.rentalAvailability.from.toString())} - {formatDate(product.rentalAvailability.to.toString())}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            className="flex-1" 
                            onClick={() => window.location.href = `/product/${product._id}`}
                          >
                            View Details
                          </Button>
                          <Button 
                            className="flex-1 bg-orange-600 hover:bg-orange-700" 
                            onClick={() => handleRentNow(product)}
                            disabled={product.quantity === 0}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {product.quantity === 0 ? "Unavailable" : "Rent Now"}
                          </Button>
                        </div>
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