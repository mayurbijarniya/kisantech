"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Star, MapPin, Leaf, Filter, Grid, List, Search } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";
import { useCart } from "@/context/cart";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  type: string[];
  salePrice?: number;
  rentalPrice?: number;
  rentalUnit?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  quantity: number;
  shipping: boolean;
  availabilityStatus: string;
  createdAt: string;
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

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();
  const { addToCart: addToCartContext } = useCart();

  // Get all products
  const getAllProducts = async () => {
    try {
      const response = await fetch("/api/product/get-product", {
        cache: 'no-store'
      });
      const data = await response.json();
      
      if (data?.success && Array.isArray(data.products)) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  // Get all categories
  const getAllCategories = async () => {
    try {
      const response = await fetch("/api/category/get-category");
      const data = await response.json();
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getAllProducts(), getAllCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category?._id === selectedCategory);
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(product => product.type.includes(selectedType));
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.salePrice || 0) - (b.salePrice || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.salePrice || 0) - (a.salePrice || 0));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedType, sortBy]);

  const addToCart = (product: Product, isRental: boolean = false) => {
    const price = isRental ? product.rentalPrice : product.salePrice;
    
    if (!price) {
      toast.error("Price not available for this item");
      return;
    }
    
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: price,
      quantity: 1,
      photo: product.photo,
      isRental: isRental,
      rentalUnit: isRental ? product.rentalUnit : undefined
    };
    
    addToCartContext(cartItem);
    toast.success(`${isRental ? 'Rental' : 'Item'} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700 rounded-lg w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-80 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-sm"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">All Products</h1>
            <p className="text-gray-600">Discover fresh agricultural products and equipment</p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
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

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sell">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center text-sm text-gray-600">
                {filteredProducts.length} products found
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
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
                    <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted/30 flex items-center justify-center">
                      <Image
                        src={`/api/product/product-photo/${product._id}`}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1546470427-e5ac2b8b5b8e?w=300&h=300&fit=crop";
                        }}
                      />
                      {product.quantity < 10 && (
                        <Badge variant="destructive" className="absolute top-2 right-2">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description.substring(0, 60)}...
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">
                            {product.category?.name}
                          </Badge>
                          {product.shipping && (
                            <Badge variant="outline" className="text-green-600">
                              <Leaf className="h-3 w-3 mr-1" />
                              Shipping
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            {product.type.includes('sell') && product.salePrice && (
                              <div className="text-lg font-bold text-primary">
                                Sale: {formatPrice(product.salePrice)}
                              </div>
                            )}
                            {product.type.includes('rent') && product.rentalPrice && (
                              <div className="text-sm font-medium text-orange-600">
                                Rent: {formatPrice(product.rentalPrice)} {product.rentalUnit}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Stock: {product.quantity}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => router.push(`/product/${product._id}`)}
                          >
                            View Details
                          </Button>
                          
                          {/* Add to Cart buttons */}
                          <div className="flex gap-1 flex-1">
                            {product.type.includes('sell') && product.salePrice && (
                              <Button 
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => addToCart(product, false)}
                                disabled={product.quantity === 0}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Buy
                              </Button>
                            )}
                            {product.type.includes('rent') && product.rentalPrice && (
                              <Button 
                                size="sm"
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-xs"
                                onClick={() => addToCart(product, true)}
                                disabled={product.quantity === 0}
                              >
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Rent
                              </Button>
                            )}
                          </div>
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