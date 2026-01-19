import dynamic from 'next/dynamic'
import { Hero } from "@/components/hero"
import { OrderProcess } from "@/components/order-process"
import { ProductsWrapper } from "@/components/products-wrapper"
import { defaultProducts, type Product } from "@/lib/store"

const SocialNotificationsWrapper = dynamic(() => import('@/components/social-notifications-wrapper').then(mod => ({ default: mod.SocialNotificationsWrapper })))
const SmartScarcity = dynamic(() => import('@/components/SmartScarcity'))
const AlternatingContents = dynamic(() => import('@/components/alternativecontent/page'))
const Testimonials = dynamic(() => import('@/components/testimonials').then(mod => ({ default: mod.Testimonials })))
const FAQs = dynamic(() => import('@/components/faqs/faqs').then(mod => ({ default: mod.FAQs })))
const DeliveryInfo = dynamic(() => import('@/components/delivery-info').then(mod => ({ default: mod.DeliveryInfo })))
const NuestrosClientes = dynamic(() => import('@/components/nuestros-clientes').then(mod => ({ default: mod.NuestrosClientes })))
const WhatsAppButton = dynamic(() => import('@/components/whatsapp-button'))

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
