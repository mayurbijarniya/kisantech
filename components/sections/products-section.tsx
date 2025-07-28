"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, MapPin, Leaf, Filter, Grid, List } from "lucide-react";
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



export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToCart: addToCartContext } = useCart();





  // Get all products with multiple fallbacks for speed
  const getAllProducts = async () => {
    try {
      setLoading(true);
      
      // Try fast API first (fastest)
      let response = await fetch("/api/product/get-fast");
      
      // If fast API fails, try simple API
      if (!response.ok) {
        console.log("Fast API failed, trying simple API...");
        response = await fetch("/api/product/get-simple");
      }
      
      // If simple API fails, try main API
      if (!response.ok) {
        console.log("Simple API failed, trying main API...");
        response = await fetch("/api/product/get-product");
      }
      
      const data = await response.json();
      
      if (data?.success && data.products) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load products on component mount
    getAllProducts();
  }, []);

  // Add a refresh function for when returning from other pages
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && products.length === 0) {
        getAllProducts();
      }
    };

    const handleFocus = () => {
      // Refresh products when window gains focus and products are empty
      if (products.length === 0) {
        getAllProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [products.length]);

  const addToCart = (product: Product) => {
    // Only add to cart if product is available for sale
    if (!product.type.includes('sell') || !product.salePrice) {
      toast.error("This item is not available for purchase");
      return;
    }
    
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.salePrice,
      quantity: 1,
      // Don't pass photo to prevent localStorage quota issues
      isRental: false
    };
    
    addToCartContext(cartItem);
    toast.success("Item added to cart");
  };

  const addToCartRental = (product: Product) => {
    // Only add to cart if product is available for rent
    if (!product.type.includes('rent') || !product.rentalPrice) {
      toast.error("This item is not available for rent");
      return;
    }
    
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.rentalPrice,
      quantity: 1,
      // Don't pass photo to prevent localStorage quota issues
      isRental: true,
      rentalUnit: product.rentalUnit
    };
    
    addToCartContext(cartItem);
    toast.success("Rental item added to cart");
  };



  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">


        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fresh, quality products directly from verified farmers
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600 mb-6">
              Products will appear here once sellers start listing them.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={getAllProducts} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => router.push("/products")}>
                View All Products
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product, index) => (
              <motion.div
                key={`${product._id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
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
                          {!product.salePrice && !product.rentalPrice && (
                            <div className="text-lg font-bold text-primary">
                              Price: Contact Seller
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
                              onClick={() => addToCart(product)}
                              disabled={product.quantity === 0}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                            </Button>
                          )}
                          {product.type.includes('rent') && product.rentalPrice && (
                            <Button 
                              size="sm"
                              className="flex-1 bg-orange-600 hover:bg-orange-700 text-xs"
                              onClick={() => addToCartRental(product)}
                              disabled={product.quantity === 0}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
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

        {/* View All Products Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" onClick={() => router.push("/products")}>
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  );
}