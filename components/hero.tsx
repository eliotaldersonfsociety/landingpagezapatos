import { Star, Truck, Package, ShieldCheck, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomerReviews } from "@/components/customer-reviews"
import Image from "next/image"


export function Hero() {
  return (
    <section className="relative overflow-hidden py-4 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center order-2 lg:order-1">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                <b>LOS MEJORES ZAPATOS QUE <span className="text-orange-500">NO SABÍAS QUE NECESITABAS</span></b>
            </h1>

            <p className="text-xs text-muted-foreground text-pretty">
              Envío rápido desde Cucuta 🇨🇴. Confiado por clientes en toda Colombia
            </p>
            <div className="flex items-center gap-8 pt-4 justify-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-8 w-8 text-orange-500" />
                <div className="text-sm text-muted-foreground">Envío rápido desde Colombia</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Package className="h-8 w-8 text-orange-500" />
                <div className="text-sm text-muted-foreground">Entrega en 1 día hábil</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-8 w-8 text-orange-500" />
                <div className="text-sm text-muted-foreground">Paga con Bancolombia, Nequi y Daviplata</div>
              </div>
            </div>
            <Button size="default" asChild className="p-0 rounded-full shadow-lg overflow-hidden">
            <a
            href="#products"
            className="
              flex flex-col items-center justify-center w-full h-full leading-tight py-2 px-6
              text-white font-semibold
              bg-gradient-to-r from-[#FFB800] to-[#FF8A00]
              hover:from-[#FFD300] hover:to-[#FF9E00]
              rounded-full
            "
          >
            {/* CTA principal */}
            <span className="text-[18px] md:text-[20px] font-extrabold tracking-wide">
              COMPRA TUS ZAPATOS
            </span>
            {/* Urgencia suave */}
            <span className="text-[10px] opacity-80 tracking-wide">
              Stock limitado disponible hoy
            </span>

            <span className="w-full h-px bg-white/50 my-1"></span>

            {/* Seguridad / pago */}
            <span className="text-[11px] opacity-95 tracking-wide flex items-center gap-1">
              <Lock/>
              Pago seguro con <strong>Bancolombia, Nequi, Daviplata</strong>
            </span>

            {/* Envío */}
            <span className="text-[11px] opacity-90 tracking-wide flex items-center gap-1">
              <Truck/>
              Envío desde <strong>Cucuta</strong> · 1 día
            </span>

          </a>
        </Button>

            <CustomerReviews />
          </div>
          <div className="relative h-[400px] lg:h-[500px] order-1 lg:order-2">
            <div className="absolute rounded-3xl bg-gradient-to-r from-blue-500 to-blue-900 opacity-40" />
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <video
                autoPlay
                loop
                muted
                className="w-full h-full object-cover mask-hero"
              >
                <source src="/zapato.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Pricing overlay */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-lg">
              <div className="text-orange-500 line-through text-base md:text-lg">Antes <br />$80.000</div>
              <div className="text-white font-bold text-xl md:text-2xl">Ahora <br />$40.000</div>
            </div>

            {/* Discount badge */}
            <div className="absolute bottom-4 left-4 md:bottom-8 md:right-8 bg-orange-500 text-white rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">50%</div>
                <div className="text-xs md:text-sm">Descuento</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}