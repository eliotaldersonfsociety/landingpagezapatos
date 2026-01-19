import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/store"

interface ProductsProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
}

export function Products({ products }: ProductsProps) {
  return (
    <section id="products" className="py-4">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            ZAPATOS <span className="text-[#FF8A00] font-black">DESTACADOS</span>
          </h2>

          <p className="text-muted-foreground text-pretty">
            ¿Cansado de zapatos incómodos que te hacen sufrir? Descubre nuestros zapatos cómodos y elegantes, perfectos para tu día a día sin dolor en los pies.
          </p>

        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}