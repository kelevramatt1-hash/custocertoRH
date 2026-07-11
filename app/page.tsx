import { Landmark } from "lucide-react"
import { FinancialCalculator } from "@/components/financial-calculator"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Landmark className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">CustoCerto RH</p>
              <p className="text-xs text-muted-foreground">Inteligência financeira de pessoas</p>
            </div>
          </div>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            CLT vs PJ
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 max-w-2xl print:mb-4">
          <h1 className="text-pretty text-2xl font-bold tracking-tight sm:text-3xl">
            Calculadora Avançada de Custo de Funcionário
          </h1>
          <p className="mt-2 text-pretty text-sm text-muted-foreground sm:text-base">
            Descubra o custo real de uma contratação CLT — com encargos, provisões e benefícios — e
            compare com o modelo PJ em segundos.
          </p>
        </div>

        <FinancialCalculator />
      </section>
    </main>
  )
}
