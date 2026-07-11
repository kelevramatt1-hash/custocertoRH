"use client"

import { Pie, PieChart, Cell, Label as RechartsLabel } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatBRL, type PayrollResult } from "@/lib/payroll"

const chartConfig = {
  salario: { label: "Salário Base", color: "var(--chart-1)" },
  encargos: { label: "Encargos / Impostos", color: "var(--chart-2)" },
  beneficios: { label: "Benefícios", color: "var(--chart-3)" },
} satisfies ChartConfig

export function CostBreakdownChart({ result }: { result: PayrollResult }) {
  const data = [
    { categoria: "salario", label: "Salário Base", valor: result.categorias.salario, fill: "var(--chart-1)" },
    { categoria: "encargos", label: "Encargos / Impostos", valor: result.categorias.encargos, fill: "var(--chart-2)" },
    { categoria: "beneficios", label: "Benefícios", valor: result.categorias.beneficios, fill: "var(--chart-3)" },
  ].filter((d) => d.valor > 0)

  const total = result.custoMensal

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Composição do custo mensal</CardTitle>
        <CardDescription>Distribuição entre salário, encargos e benefícios.</CardDescription>
      </CardHeader>
      <CardContent className="grid items-center gap-6 sm:grid-cols-2">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[240px] w-full">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel formatter={(v) => formatBRL(Number(v))} />}
            />
            <Pie
              data={data}
              dataKey="valor"
              nameKey="categoria"
              innerRadius={58}
              outerRadius={100}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.categoria} fill={d.fill} />
              ))}
              <RechartsLabel
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-bold">
                          {formatBRL(total)}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground text-xs">
                          Total / mês
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex flex-col gap-3">
          {data.map((d) => {
            const pct = total > 0 ? (d.valor / total) * 100 : 0
            return (
              <div key={d.categoria} className="flex items-center gap-3">
                <span className="size-3 shrink-0 rounded-sm" style={{ backgroundColor: d.fill }} />
                <div className="flex flex-1 items-baseline justify-between gap-2">
                  <span className="text-sm text-foreground">{d.label}</span>
                  <span className="text-sm font-semibold tabular-nums">{pct.toFixed(1)}%</span>
                </div>
                <span className="w-28 text-right text-sm tabular-nums text-muted-foreground">
                  {formatBRL(d.valor)}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
