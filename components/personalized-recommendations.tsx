"use client"

import { useEffect, useState } from "react"
import * as tf from "@tensorflow/tfjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { productsStorage, type Product } from "@/lib/store"
import { useCart } from "@/context/cart-context"

export function PersonalizedRecommendations() {
  const { addToCart } = useCart()
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const products = productsStorage.get()
    // Show other shoes
    if (products.length >= 3) {
      setRecommendations([products[1], products[2]]) // other shoes
    } else {
      setRecommendations(products.slice(0, 2))
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cargando recomendaciones...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Completa tu compra</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {recommendations.map((product, index) => (
            <div key={product.id} className="border rounded-lg p-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-20 object-cover rounded mb-1"
              />
              <h3 className="font-semibold text-xs line-clamp-2">{product.name}</h3>
              <p className="text-xs text-muted-foreground mb-1">
                ${product.price}
              </p>
              <button onClick={() => addToCart(product)} className="w-full bg-orange-500 text-white py-1 px-2 rounded text-xs hover:bg-orange-600">
                Agregar
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}