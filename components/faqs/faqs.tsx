import Image from "next/image"
import { FAQAccordionClient } from "./faq-accordion-client"

const faqs = [
  {
    question: "📦 ¿Cómo funciona el envío?",
    answer:
      "Ofrecemos envío personal en Colombia. Una vez confirmado tu pedido, coordinamos directamente contigo para entregar tus zapatos de forma segura en la puerta de tu casa.",
  },
  {
    question: "🚚 ¿Cuánto tiempo tarda el envío?",
    answer:
      "El envío generalmente toma 24 a 48 horas, dependiendo de tu ubicación en Colombia.",
  },
  {
    question: "📍 ¿Entregan fuera de Colombia?",
    answer:
      "Por el momento, el envío personal solo está disponible en Colombia.",
  },
  {
    question: "👟 ¿Qué tipos de zapatos ofrecen?",
    answer:
      "Ofrecemos zapatos deportivos, casuales y de trabajo, todos de alta calidad y cómodos para el uso diario.",
  },
  {
    question: "📲 ¿Cómo confirmo mi pedido?",
    answer:
      "Realiza tu pedido de forma segura. Nos contactamos contigo para programar el envío.",
  },
]

export function FAQs() {
  return (
    <section id="faqs" className="py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-8">
          {/* ICON */}
          <Image
            src="/interrogacion.webp"
            alt="Frequently Asked Questions"
            width={60}
            height={80}
            sizes="60px"
            className="mr-4"
          />

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-left">
            PREGUNTAS <br />
            <span className="text-[#FF8A00] font-black">
              FRECUENTES
            </span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <FAQAccordionClient faqs={faqs} />
        </div>
      </div>
    </section>
  )
}
