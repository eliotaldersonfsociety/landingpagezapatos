import dynamic from 'next/dynamic'
import { SocialNotificationsWrapper } from "@/components/social-notifications-wrapper"
import { Hero } from "@/components/hero"
import AlternatingContents from "@/components/alternativecontent/page"
import { OrderProcess } from "@/components/order-process"
import { ProductsWrapper } from "@/components/products-wrapper"
import { Testimonials } from "@/components/testimonials"
import { FAQs } from "@/components/faqs/faqs"
import { DeliveryInfo } from "@/components/delivery-info"
import { defaultProducts, type Product } from "@/lib/store"
import { NuestrosClientes } from '@/components/nuestros-clientes'
import WhatsAppButton from '@/components/whatsapp-button'
import SmartScarcity from '@/components/SmartScarcity'

const ResultsCarouselClient = dynamic(() => import('@/components/result-carrousel/results-carousel.client'))
const AITestimonials = dynamic(() => import('@/components/ai-testimonials'))
const AIChat = dynamic(() => import('@/components/ai-chat'))
const PersonalizedRecommendations = dynamic(() => import('@/components/personalized-recommendations').then(mod => ({ default: mod.PersonalizedRecommendations })))
const PredictiveHeatmap = dynamic(() => import('@/components/predictive-heatmap').then(mod => ({ default: mod.PredictiveHeatmap })))
const RealtimeBehaviorPanel = dynamic(() => import('@/components/RealtimeBehaviorPanel').then(mod => ({ default: mod.RealtimeBehaviorPanel })))

export default function HomePage() {

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 md:px-0 text-center">
      <SocialNotificationsWrapper />
      <SmartScarcity/>
      <Hero />
      <OrderProcess />
      <div className="flex items-center justify-center gap-4 font-sans text-center pt-4">
        <span className="text-red-600 font-bold text-xs line-through">
          Antes 80.000$
        </span>

        <span className="bg-orange-500 text-white font-extrabold text-sm px-4 py-1 rounded-lg shadow-md">
          ahora 40.000$
        </span>

        <span className="hidden md:inline text-green-600 font-semibold text-2xl">
          50% descuento – ¡No pierdas la oportunidad!
        </span>
      </div>
      <ProductsWrapper products={defaultProducts.slice(0, 1)} />
      <PersonalizedRecommendations />
      <AlternatingContents />
      <ResultsCarouselClient />
      <NuestrosClientes />
      <AITestimonials />
      <div className="md:grid md:grid-cols-2 md:gap-8">
        <DeliveryInfo />
        <FAQs />
      </div>
      <AIChat />
      <OrderProcess />
      <WhatsAppButton />
    </div>
  )
}
