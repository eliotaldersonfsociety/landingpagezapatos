// components/product-card.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, Truck, Lock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Product } from "@/lib/store";
import { DynamicPricing } from "@/components/dynamic-pricing";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const { addToCart } = useCart();

  /* ===============================
     OBSERVER: PRODUCT IN VIEW
  =============================== */
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Card
        className={`group overflow-hidden transition-all duration-300 ${
          inView ? "ring-[0.5px] ring-green-400 shadow-lg" : ""
        }`}
      >
        <CardContent className="p-0">
          <div className="relative h-64 overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
            <Badge className="absolute top-3 right-3 bg-amber-400">
              {product.category}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-3 p-6">
          <div className="flex-1 w-full text-center">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>

            <div className="mt-4 text-green-600 font-semibold">
              <DynamicPricing basePrice={product.price} productId={product.id} />
            </div>

            {/* Payment Logos Ribbon */}
            <div className="mt-4 flex justify-center gap-2 p-2 bg-gray-100 rounded-lg">
              <Image src="/nequi.svg" alt="Nequi" width={48} height={48} />
              <Image src="/bancolombia.svg" alt="Bancolombia" width={48} height={48} />
              <Image src="/daviplata.svg" alt="Daviplata" width={48} height={48} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <Button
                onClick={() => addToCart(product, 1)}
                className={`group transition-all hover:scale-105 hover:bg-green-500 hover:text-white ${
                  inView
                    ? "bg-yellow-500 hover:bg-orange-500 text-black"
                    : "bg-primary hover:bg-primary/90"
                }`}
                size="sm"
              >
                <span className="group-hover:hidden">{product.name.length > 10 ? product.name.substring(0,10) + '...' : product.name} x1 - ${product.price}</span>
                <span className="hidden group-hover:inline">Agregar al carrito x1</span>
              </Button>
              <Button
                onClick={() => addToCart(product, 2)}
                className={`group transition-all hover:scale-105 hover:bg-green-500 hover:text-white ${
                  inView
                    ? "bg-yellow-500 hover:bg-orange-500 text-black"
                    : "bg-primary hover:bg-primary/90"
                }`}
                size="sm"
              >
                <span className="group-hover:hidden">{product.name.length > 10 ? product.name.substring(0,10) + '...' : product.name} x2 - 10% off - ${(product.price * 2 * 0.9)}</span>
                <span className="hidden group-hover:inline">Agregar al carrito x2</span>
              </Button>
              <Button
                onClick={() => addToCart(product, 3)}
                className={`group w-full transition-all hover:scale-105 relative hover:bg-green-500 hover:text-white ${
                  inView
                    ? "bg-yellow-500 hover:bg-orange-500 text-black"
                    : "bg-primary hover:bg-primary/90"
                }`}
                size="sm"
              >
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded transform rotate-10">FAMILIA</span>
                <span className="group-hover:hidden">{product.name.length > 10 ? product.name.substring(0,10) + '...' : product.name} x3 - 15% off - ${(product.price * 3 * 0.85)}</span>
                <span className="hidden group-hover:inline">Agregar al carrito x3</span>
              </Button>
              <Button
                onClick={() => addToCart(product, 4)}
                className={`group w-full transition-all hover:scale-105 relative animate-pulse hover:bg-green-500 hover:text-white ${
                  inView
                    ? "bg-yellow-500 hover:bg-orange-500 text-black"
                    : "bg-primary hover:bg-primary/90"
                }`}
                size="sm"
              >
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1 rounded transform rotate-10">REGALO</span>
                <span className="group-hover:hidden">{product.name.length > 10 ? product.name.substring(0,10) + '...' : product.name} x4 - 20% off - ${(product.price * 4 * 0.8)}</span>
                <span className="hidden group-hover:inline">Agregar al carrito x4</span>
              </Button>
            </div>

            {/* Security and Trust Elements */}
            {inView && (
              <>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Pago seguro con encriptación SSL</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4 text-green-500" />
                  <span>Envío rápido a toda Colombia · 1-3 días hábiles</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Garantía de devolución de 30 días</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground text-center">
                  ✓ Sin cargos ocultos · ✓ Soporte al cliente 24/7 · ✓ Confiado por miles
                </div>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}