"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const clients = [
  "/cliente1.png",
  "/cliente2.png",
  "/cliente3.png"
]

export function NuestrosClientes() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % clients.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <h2 className="text-3xl font-bold text-center mb-8">NUESTROS <span className="text-orange-500">CLIENTES</span></h2>

        {/* Desktop: 3 imágenes lado a lado */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {clients.map((client, index) => (
            <div key={index} className="flex justify-center">
              <Image
                src={client}
                alt={`Cliente ${index + 1}`}
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
          ))}
        </div>

        {/* Mobile: Carrusel automático */}
        <div className="md:hidden flex justify-center">
          <Image
            src={clients[currentIndex]}
            alt={`Cliente ${currentIndex + 1}`}
            width={200}
            height={100}
            className="object-contain transition-opacity duration-500"
          />
        </div>
      </div>
    </section>
  )
}