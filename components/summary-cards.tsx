import { Wallet, TrendingUp, CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatBRL, type PayrollResult } from "@/lib/payroll"

export function SummaryCards({ result }: { result: PayrollResult }) {
  const cards = [
    {
      label: "Custo Mensal Total",
      value: formatBRL(result.custoMensal),
      hint: "Salário + encargos + benefícios",
      icon: Wallet,
      accent: false,
    },
    {
      label: "Multiplicador sobre o salário",
      value: `${result.multiplicador.toFixed(2)}x`,
      hint: `Para cada R$ 1,00 de salário bruto`,
      icon: TrendingUp,
      accent: true,
    },
    {
      label: "Custo Anual Projetado",
      value: formatBRL(result.custoAnual),
      hint: "Projeção de 12 meses",
      icon: CalendarDays,
      accent: false,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <Card
          key={c.label}
          className={
            c.accent
              ? "border-transparent bg-primary text-primary-foreground shadow-sm"
              : "border-border/70 shadow-sm"
          }
        >
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span
                className={
                  c.accent
                    ? "text-xs font-medium text-primary-foreground/80"
                    : "text-xs font-medium text-muted-foreground"
                }
              >
                {c.label}
              </span>
              <c.icon
                className={c.accent ? "size-4 text-primary-foreground/80" : "size-4 text-primary"}
              />
            </div>
            <p className="text-2xl font-bold tabular-nums tracking-tight">{c.value}</p>
            <p
              className={
                c.accent
                  ? "text-xs text-primary-foreground/70"
                  : "text-xs text-muted-foreground"
              }
            >
              {c.hint}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
