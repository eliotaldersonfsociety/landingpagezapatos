import Image from "next/image"
import { Play } from "lucide-react"

interface ResultsCarouselProps {
  isPlaying: boolean
  onPlay: () => void
  onEnded: () => void
}

export function ResultsCarousel({
  isPlaying,
  onPlay,
  onEnded,
}: ResultsCarouselProps) {
  return (
    <section id="results" className="py-4">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        {/* TEXT */}
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold">
            DESCUBRE NUESTROS{" "}
            <span className="text-[#FF8A00] font-black">
              ZAPATOS
            </span>
          </h2>

          <p className="text-muted-foreground">
            Obtén nuestra promoción especial: Zapatos cómodos y elegantes,
            perfectos para hombres y mujeres, con envío gratis por solo $40.000.
          </p>
        </div>

        {/* MEDIA */}
        <div className="relative w-full max-w-md mx-auto aspect-square">
          {!isPlaying ? (
            <button
              onClick={onPlay}
              className="relative group w-full h-full rounded-lg overflow-hidden"
            >
              {/* PREVIEW IMAGE */}
              <Image
                src="/zapato.webp"
                alt="Labubu preview"
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover"
              />

              {/* OVERLAY */}
              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="bg-black/50 p-4 rounded-full group-hover:scale-110 transition">
                  <Play className="w-8 h-8 text-white" />
                </span>
              </span>
            </button>
          ) : (
            <video
              src="/zapato1.mp4"
              autoPlay
              controls
              playsInline
              preload="metadata"
              className="w-full max-w-md mx-auto rounded-xl shadow-lg"
              onEnded={onEnded}
            />
          )}
        </div>
      </div>
    </section>
  )
}
