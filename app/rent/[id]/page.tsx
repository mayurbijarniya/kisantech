"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, ArrowLeft, ShoppingCart, Wrench, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cart";
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

export default function RentProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<RentalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [rentalDuration, setRentalDuration] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (params.id) {
      getSingleProduct();
    }
  }, [params.id]);

  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`/api/product/get-product/${params.id}`);
      if (data?.success) {
        const productData = data.product;
        // Check if product is available for rent
        if (productData.type.includes('rent')) {
          setProduct(productData);
        } else {
          toast.error("This product is not available for rent");
          router.push("/rent");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching product details");
      router.push("/rent");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }

    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.rentalPrice * rentalDuration,
      quantity: 1,
      // Don't pass photo to prevent localStorage quota issues
      isRental: true,
      rentalUnit: product.rentalUnit,
      rentalDuration,
      startDate,
      endDate
    };
    
    addToCart(cartItem);
    toast.success("Rental item added to cart");
  };

  const calculateTotalPrice = () => {
    if (!product || !rentalDuration) return 0;
    return product.rentalPrice * rentalDuration;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-square bg-muted rounded-lg" />
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-6 bg-muted rounded w-1/3" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The rental product you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/rent")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rentals
            </Button>
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
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => router.push("/rent")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rentals
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={`/api/product/product-photo/${product._id}`}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEzMEg3MEwxMDAgNzBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=";
                    }}
                  />
                  {product.shipping && (
                    <Badge className="absolute top-4 right-4 bg-green-600">
                      <Wrench className="h-3 w-3 mr-1" />
                      Delivery Available
                    </Badge>
                  )}
                  <Badge className="absolute bottom-4 left-4 bg-orange-600">
                    For Rent
                  </Badge>
                </div>
              </Card>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <Badge variant="secondary" className="mb-4">
                  {product.category?.name}
                </Badge>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Pricing */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{product.rentalPrice.toLocaleString()} {product.rentalUnit}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Available: {product.quantity} units
                      </span>
                    </div>
                    
                    {/* Rental Duration */}
                    <div className="space-y-2">
                      <Label htmlFor="duration">Rental Duration ({product.rentalUnit}s)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        value={rentalDuration}
                        onChange={(e) => setRentalDuration(parseInt(e.target.value) || 1)}
                        className="w-full"
                      />
                    </div>

                    {/* Date Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total Price:</span>
                        <span className="text-orange-600">
                          ₹{calculateTotalPrice().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  View Full Details
                </Button>
                <Button 
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0 || !startDate || !endDate}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Additional Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Rental Unit: {product.rentalUnit}</span>
                    </div>
                    {product.shipping && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Delivery available</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Available for immediate rental</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}