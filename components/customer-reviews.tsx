"use client"

import { Star } from "lucide-react"
import { useState, useEffect } from "react"

const reviews = [
  "¡Increíbles zapatos! Llegaron perfectamente a Bogotá. Los zapatos son tan cómodos y bien hechos.",
  "¡Entrega rápida a Medellín! Mis zapatos superaron las expectativas. Gran calidad.",
  "¡Amo mis nuevos zapatos! Enviados rápidamente y llegaron en perfectas condiciones. Tan cómodos.",
  "Los zapatos llegaron seguros a Cali. Excelente empaque y diseño adorable.",
  "¡Super feliz con mi compra de zapatos! Entregados a tiempo y son geniales para caminar.",
  "¡Los zapatos son increíbles! Llegaron sin problemas. Altamente recomendados.",
  "¡Envío rápido! Mis zapatos son aún más cómodos en persona. Calidad asombrosa.",
  "Recibí mis zapatos perfectamente. Estos zapatos traen tanta comodidad. ¡Gran compra!",
  "Zapatos llegaron rápido. Son detallados y cómodos. Valen cada peso.",
  "¡Emocionado con mis zapatos! Enviados de forma segura y llegaron rápido. Nunca decepciona."
]

const users = [
  { name: "María G.", location: "Bogotá", gender: "women" },
  { name: "Carlos R.", location: "Medellín", gender: "men" },
  { name: "Ana L.", location: "Cali", gender: "women" },
  { name: "Juan P.", location: "Cartagena", gender: "men" },
  { name: "Sofia M.", location: "Barranquilla", gender: "women" },
  { name: "Diego S.", location: "Pereira", gender: "men" },
  { name: "Laura T.", location: "Manizales", gender: "women" },
  { name: "Andrés V.", location: "Bucaramanga", gender: "men" },
  { name: "Camila H.", location: "Ibagué", gender: "women" },
  { name: "Felipe W.", location: "Santa Marta", gender: "men" }
]

export function CustomerReviews() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const user = users[index % users.length]
  const avatarId = (index % 50) + 1

  return (
    <div className="flex items-start gap-3 mt-6">
      {/* Avatar */}
      <img
        src={`https://randomuser.me/api/portraits/${user.gender}/${avatarId}.jpg`}
        alt={user.name}
        className="w-10 h-10 rounded-full border-2 border-orange-500 flex-shrink-0"
      />

      {/* Content */}
      <div className="flex flex-col gap-1">
        {/* Username + location */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {user.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {user.location}
          </span>
          <span className="text-sm">🇨🇴</span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((star) => (
            <Star
              key={star}
              className="h-4 w-4 fill-orange-500 text-orange-500"
            />
          ))}
          <Star className="h-4 w-4 fill-orange-500/50 text-orange-500" />
          <span className="ml-1 text-xs font-medium text-muted-foreground">
            4.5
          </span>
        </div>

        {/* Review text */}
        <p className="text-sm text-muted-foreground max-w-xs">
          {reviews[index]}
        </p>
      </div>
    </div>
  )
}
