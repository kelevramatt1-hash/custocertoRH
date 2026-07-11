"use client"

import { useMemo, useState } from "react"
import { FileDown, BarChart3, GitCompareArrows } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CostInputForm } from "@/components/cost-input-form"
import { SummaryCards } from "@/components/summary-cards"
import { CostBreakdownChart } from "@/components/cost-breakdown-chart"
import { CostDetailTable } from "@/components/cost-detail-table"
import { PjComparison } from "@/components/pj-comparison"
import { calcularCusto, REGIME_LABEL, type PayrollInput } from "@/lib/payroll"

const INITIAL: PayrollInput = {
  regime: "simples",
  salario: 5000,
  valeTransporte: { enabled: true, valor: 250 },
  valeRefeicao: { enabled: true, valor: 600 },
  assistenciaMedica: { enabled: true, valor: 350 },
  encargos: { fgts: true, decimoTerceiro: true, ferias: true },
  pjValor: 6500,
  pjAliquota: 0.06,
}

export function FinancialCalculator() {
  const [input, setInput] = useState<PayrollInput>(INITIAL)
  const [applied, setApplied] = useState<PayrollInput>(INITIAL)

  const result = useMemo(() => calcularCusto(applied), [applied])

  function handleCalcular() {
    setApplied({ ...input })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(340px,400px)_minmax(0,1fr)]">
      {/* Coluna de entrada */}
      <div className="lg:sticky lg:top-6 lg:self-start print:hidden">
        <CostInputForm input={input} setInput={setInput} onCalcular={handleCalcular} />
      </div>

      {/* Coluna de resultados */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 print:mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Resultado do cálculo</h2>
              <p className="text-sm text-muted-foreground">
                Regime: <span className="font-medium text-foreground">{REGIME_LABEL[applied.regime]}</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 print:hidden"
              onClick={() => window.print()}
            >
              <FileDown className="size-4" />
              Exportar Relatório em PDF
            </Button>
          </div>
        </div>

        <SummaryCards result={result} />

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="print:hidden">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="size-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="pj" className="gap-2">
              <GitCompareArrows className="size-4" />
              Comparar com PJ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-4 flex flex-col gap-6">
            <CostBreakdownChart result={result} />
            <CostDetailTable result={result} />
          </TabsContent>

          <TabsContent value="pj" className="mt-4">
            <PjComparison input={input} setInput={setInput} result={result} />
          </TabsContent>
        </Tabs>

        {/* Versão impressa: mostra tudo */}
        <div className="hidden flex-col gap-6 print:flex">
          <CostBreakdownChart result={result} />
          <CostDetailTable result={result} />
          <PjComparison input={input} setInput={setInput} result={result} />
        </div>
      </div>
    </div>
  )
}
