"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"

interface Section {
  type: "image" | "video"
  titlePart1: string
  titlePart2: string
  description: string
  media: string
  poster?: string
}

const sections: Section[] = [
  {
    type: "video",
    titlePart1: "🎁 ZAPATOS DE CALIDAD",
    titlePart2: "PARA CADA OCASIÓN 👟",
    description: `
Cada par incluye:
• Zapatos cómodos y duraderos — ¡el confort es lo primero!
• Materiales de alta calidad

🚚 Envío desde Cucuta · 1 día hábil

📦 QUÉ INCLUYE
✔ Zapatos resistentes y elegantes
✔ Perfectos para el día a día y deportes

Olvídate del dolor en los pies.
Cada par es una experiencia de comodidad 🎉
    `,
    media: "/zapato2.mp4",
    poster: "/zapato.webp",
  },
  {
    type: "image",
    titlePart1: "EL REGALO PERFECTO",
    titlePart2: "QUE RECORDARÁN 🎁",
    description:
      "Empacados con cuidado y listos para sorprender.\n🎄 Ideales para cumpleaños y fiestas\n🎁 Empaque premium\n😊 Sonrisas garantizadas",
    media: "/zapatoregalo.webp",
  },
  {
    type: "image",
    titlePart1: "MÁS QUE ZAPATOS",
    titlePart2: "TU MEJOR ALIADO 💛",
    description:
      "Suaves, cómodos y diseñados para brindar confort en cualquier lugar.\nUn abrazo que no querrás soltar.",
    media: "/zapatofuego.webp",
  },
  {
    type: "image",
    titlePart1: "AMADOS POR TODOS",
    titlePart2: "CONFIABLES PARA SIEMPRE ✅",
    description:
      "Perfectos para el trabajo, el deporte y aventuras diarias.\n✔ Materiales seguros\n✔ Fáciles de limpiar\n✔ Comodidad aprobada",
    media: "/zapatosparatodos.webp",
  },
  {
    type: "image",
    titlePart1: "ENVÍO RÁPIDO DESDE",
    titlePart2: "CUCUTA 🚚",
    description:
      "Cumplidos en Colombia.\nEnvío rápido desde Cucuta\nSin esperas largas\n\n🔒 Pago seguro · Paga con Bancolombia, Nequi o Daviplata\nTu pago está 100% protegido",
    media: "/servientrega.avif",
  },
]

export function AlternatingContent() {
  const [playing, setPlaying] = useState<number | null>(null)

  return (
    <section className="py-1">
      <div className="container mx-auto px-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          >
            {/* TEXT */}
            <div
              className={`space-y-4 ${
                index % 2 === 0 ? "order-2 lg:order-1" : "order-2"
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {section.titlePart1}{" "}
                <span className="text-orange-500">
                  {section.titlePart2}
                </span>
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.description}
              </p>

              {/* Micro trust line only on first section */}
              {index === 0 && (
                <p className="text-[11px] text-muted-foreground opacity-80">
                  🔒 Secure checkout · Bancolombia · Nequi · Daviplata
                </p>
              )}
            </div>

            {/* MEDIA */}
            <div
              className={`relative ${
                index % 2 === 0 ? "order-1 lg:order-2" : "order-1"
              }`}
            >
              {section.type === "video" ? (
                playing === index ? (
                  <video
                    src={section.media}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                    aria-label="Labubu promotional video"
                  />
                ) : (
                  <button
                    onClick={() => setPlaying(index)}
                    aria-label="Play Labubu video"
                    className="relative group w-full max-w-md mx-auto"
                  >
                    <Image
                      src={section.poster!}
                      alt="Labubu video preview"
                      width={616}
                      height={320}
                      sizes="w-full max-w-md mx-auto rounded-xl shadow-lg"
                      className="w-full h-64 lg:h-80 object-cover rounded-xl"
                    />

                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/60 p-4 rounded-full group-hover:scale-110 transition">
                        <Play className="w-8 h-8 text-white" />
                      </span>
                    </span>
                  </button>
                )
              ) : (
                <Image
                  src={section.media}
                  alt={`${section.titlePart1} ${section.titlePart2}`}
                  width={616}
                  height={320}
                  sizes="(max-width: 768px) 100vw, 616px"
                  className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-md"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
