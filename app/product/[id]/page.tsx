"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart";
import { ShoppingCart, Truck, Shield, Star } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  type: string[];
  salePrice?: number;
  rentalPrice?: number;
  rentalUnit?: string;
  category: {
    _id: string;
    name: string;
  };
  quantity: number;
  shipping: boolean;
  availabilityStatus: string;
  photo?: {
    data: Buffer;
    contentType: string;
  };
  createdAt: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/product/get-product/${params.id}`);
      if (data.success) {
        setProduct(data.product);
        fetchRelatedProducts(data.product.category._id);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId: string) => {
    try {
      const { data } = await axios.get(`/api/product/related-products/${categoryId}/${params.id}`);
      if (data.success) {
        setRelatedProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      if (!product.type.includes('sell') || !product.salePrice) {
        toast.error("This item is not available for purchase");
        return;
      }
      
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.salePrice,
        quantity: 1,
        photo: product.photo
      });
      toast.success("Added to cart successfully!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-6 rounded"></div>
                <div className="bg-gray-200 h-20 rounded"></div>
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
        <main className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative">
            <Card>
              <CardContent className="p-0">
                {product.photo ? (
                  <Image
                    src={`data:${product.photo.contentType};base64,${Buffer.from(product.photo.data).toString('base64')}`}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-20 w-20 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.5 out of 5)</span>
              </div>
              <div className="space-y-2 mb-4">
                {product.type.includes('sell') && product.salePrice && (
                  <p className="text-3xl font-bold text-green-600">
                    Sale Price: ₹{product.salePrice.toLocaleString()}
                  </p>
                )}
                {product.type.includes('rent') && product.rentalPrice && (
                  <p className="text-2xl font-bold text-orange-600">
                    Rental: ₹{product.rentalPrice.toLocaleString()} {product.rentalUnit}
                  </p>
                )}
                {!product.salePrice && !product.rentalPrice && (
                  <p className="text-2xl font-bold text-gray-600">
                    Contact seller for pricing
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm">Quality Assured</span>
              </div>
              {product.shipping && (
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Free Shipping</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Availability:</span>
                <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                  {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                </Badge>
              </div>

              <div className="space-y-3">
                {product.type.includes('sell') && product.salePrice && (
                  <Button 
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0 || product.availabilityStatus !== 'available'}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.quantity > 0 ? "Add to Cart - Buy Now" : "Out of Stock"}
                  </Button>
                )}
                
                {product.type.includes('rent') && product.rentalPrice && (
                  <Button 
                    onClick={() => window.location.href = `/rent/${product._id}`}
                    disabled={product.quantity === 0 || product.availabilityStatus !== 'available'}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                  >
                    Rent This Item
                  </Button>
                )}
                
                {!product.salePrice && !product.rentalPrice && (
                  <Button 
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled
                  >
                    Contact Seller for Pricing
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      {relatedProduct.photo ? (
                        <Image
                          src={`data:${relatedProduct.photo.contentType};base64,${Buffer.from(relatedProduct.photo.data).toString('base64')}`}
                          alt={relatedProduct.name}
                          width={200}
                          height={200}
                          className="w-full h-40 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <div className="space-y-1">
                      {relatedProduct.type.includes('sell') && relatedProduct.salePrice && (
                        <p className="text-green-600 font-bold">₹{relatedProduct.salePrice.toLocaleString()}</p>
                      )}
                      {relatedProduct.type.includes('rent') && relatedProduct.rentalPrice && (
                        <p className="text-orange-600 font-medium text-sm">₹{relatedProduct.rentalPrice.toLocaleString()} {relatedProduct.rentalUnit}</p>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => window.location.href = `/product/${relatedProduct._id}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}