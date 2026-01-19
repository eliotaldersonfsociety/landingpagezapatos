// app/checkout/checkout-client.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OrderConfirmation } from "@/components/order-confirmation";
import { completeOrderAction } from "@/lib/actions/orders";
import { cartStorage, CartItem } from "@/lib/store";
import { useConversionScore } from "@/hooks/useConversionScore";


interface CheckoutClientProps {
  isLoggedIn: boolean;
}

export default function CheckoutClient({ isLoggedIn }: CheckoutClientProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const score = useConversionScore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>(""); // ✅ nuevo campo opcional
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "cash_on_delivery">("transfer");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleCompleteOrder = async () => {
    if (paymentMethod === "transfer" && !paymentProof) return;

    // Validar email si no está logueado
    if (!isLoggedIn && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      setError("Por favor ingresa un email válido.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("phone", phone);
      formData.append("additionalInfo", additionalInfo);
      formData.append("paymentMethod", paymentMethod);
      if (paymentProof) formData.append("file", paymentProof);

      const result = await completeOrderAction(formData);
      if (!result.success) {
        setError(result.error!);
        return;
      }

      cartStorage.clear();
      setOrderConfirmed(true);
    } catch (err: any) {
      setError(err.message || "Error al completar el pedido");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    setTheme("light");
    setCartItems(cartStorage.get());
  }, [setTheme]);

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? price.toString() : price.toFixed(2);
  };

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const discountedPrice = (() => {
        if (item.quantity === 2) return item.price * 0.9;
        if (item.quantity === 3) return item.price * 0.85;
        if (item.quantity === 4) return item.price * 0.8;
        return item.price;
      })();
      return sum + discountedPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  const orderItems = cartItems.flatMap((item) =>
    Array(item.quantity).fill({
      name: item.name,
      price: item.price,
    })
  );



  if (orderConfirmed) {
    const confirmationItems = cartItems.map((item) => {
      const discountedPrice = (() => {
        if (item.quantity === 2) return item.price * 0.9;
        if (item.quantity === 3) return item.price * 0.85;
        if (item.quantity === 4) return item.price * 0.8;
        return item.price;
      })();
      const totalForItem = discountedPrice * item.quantity;
      const discountLabel = (() => {
        if (item.quantity === 2) return ' (10% OFF)';
        if (item.quantity === 3) return ' (FAMILIA)';
        if (item.quantity === 4) return ' (REGALO)';
        return '';
      })();
      return {
        name: `${item.name} x${item.quantity}${discountLabel}`,
        price: formatPrice(totalForItem),
      };
    });

    return (
      <div className="min-h-screen container mx-auto px-4 flex items-center justify-center">
        <OrderConfirmation items={confirmationItems} />
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-10">
      <h1 className="text-4xl font-black text-center uppercase mb-6">
        Completa tu <span className="text-[#FF8A00]">compra</span>
      </h1>

      {score < 0.35 && (
        <p className="text-red-600 text-center font-semibold">
          ⚠️ Alta demanda — stock limitado
        </p>
      )}
      {score >= 0.35 && score < 0.7 && (
        <p className="text-orange-500 text-center">🔥 Los clientes están comprando ahora</p>
      )}
      {score >= 0.7 && (
        <p className="text-green-600 text-center">✅ Pago seguro</p>
      )}

      <div className="max-w-2xl mx-auto space-y-6 mt-6">
        {/* EMAIL & NAME */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoggedIn ? (
              <p className="text-green-600">Sesión iniciada. Los datos se obtendrán de tu cuenta.</p>
            ) : (
              <>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="login">
                    <AccordionTrigger className="text-center">
                      ¿Ya tienes cuenta? Inicia sesión aquí
                    </AccordionTrigger>
                    <AccordionContent className="flex justify-center">
                      <Button asChild>
                        <a href="/login?redirect=/checkout">Iniciar Sesión</a>
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div>
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Te enviaremos el recibo aquí.
                  </p>
                </div>

                <div>
                  <Label htmlFor="name">Nombre (opcional)</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Déjalo en blanco si no quieres especificar.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* SHIPPING */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Envío</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                type="text"
                placeholder="Calle 123 #45-67"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                type="text"
                placeholder="Bogotá"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="300 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* SUMMARY */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              <>
                {cartItems.map((item, i) => {
                  const discountedPrice = (() => {
                    if (item.quantity === 2) return item.price * 0.9;
                    if (item.quantity === 3) return item.price * 0.85;
                    if (item.quantity === 4) return item.price * 0.8;
                    return item.price;
                  })();
                  const totalForItem = discountedPrice * item.quantity;
                  return (
                    <div key={i} className="flex justify-between py-1 items-center">
                      <div className="flex items-center gap-2">
                        <span>{item.name} × {item.quantity}</span>
                        {item.quantity === 2 && <span className="bg-blue-500 text-white text-xs px-1 rounded">10% OFF</span>}
                        {item.quantity === 3 && <span className="bg-red-500 text-white text-xs px-1 rounded transform rotate-10">FAMILIA</span>}
                        {item.quantity === 4 && <span className="bg-green-500 text-white text-xs px-1 rounded transform rotate-10">REGALO</span>}
                      </div>
                      <span>${formatPrice(totalForItem)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between font-bold mt-3 pt-3 border-t">
                  <span>Total</span>
                  <span>${formatPrice(total)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* PAYPAL */}
        <Card>
          <CardHeader>
            <CardTitle>Pago</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <Label className="text-base font-medium">Método de Pago</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value: "transfer" | "cash_on_delivery") => setPaymentMethod(value)} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer">Transferencia Bancaria</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                  <Label htmlFor="cash_on_delivery">Pago contra Entrega</Label>
                </div>
              </RadioGroup>
            </div>
            {paymentMethod === "transfer" && (
              <>
                <Accordion type="single" collapsible className="w-full mb-4">
                  <AccordionItem value="nequi">
                    <AccordionTrigger className="flex items-center justify-center">
                      <Image src="/nequi.svg" alt="Nequi" width={100} height={40} />
                    </AccordionTrigger>
                    <AccordionContent className="flex justify-center">
                      <Image src="/qrnequi.webp" alt="QR Nequi" width={200} height={200} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="bancolombia">
                    <AccordionTrigger className="flex items-center justify-center">
                      <Image src="/bancolombia.svg" alt="Bancolombia" width={100} height={40} />
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col items-center">
                      <Image src="/qrbancolombia.jpeg" alt="QR Bancolombia" width={200} height={200} />
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm">08895966552</span>
                        <Button size="sm" onClick={() => copyToClipboard("08895966552")}>
                          {copied === "08895966552" ? "Copiado" : "Copiar"}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="daviplata">
                    <AccordionTrigger className="flex items-center justify-center">
                      <Image src="/daviplata.svg" alt="Daviplata" width={100} height={40} />
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col items-center">
                      <Image src="/qrdaviplata.png" alt="QR Daviplata" width={200} height={200} />
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm">300975612</span>
                        <Button size="sm" onClick={() => copyToClipboard("300975612")}>
                          {copied === "300975612" ? "Copiado" : "Copiar"}
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="payment-proof">Subir Comprobante de Pago</Label>
                    <Input
                      id="payment-proof"
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Solo imágenes JPG o PNG, máximo 1 MB.
                    </p>
                  </div>
                </div>
              </>
            )}
            <div className="mt-4">
              <Button onClick={handleCompleteOrder} disabled={(paymentMethod === "transfer" && !paymentProof) || uploading} className="w-full">
                {uploading ? "Procesando..." : "Completar Pedido"}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </CardContent>
        </Card>

        {/* NOTES */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="ej. mensaje de regalo, instrucciones de entrega"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}