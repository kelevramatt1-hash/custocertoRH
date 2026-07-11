"use client"

import type { Dispatch, SetStateAction } from "react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatBRL, type PayrollInput, type PayrollResult } from "@/lib/payroll"

interface Props {
  input: PayrollInput
  setInput: Dispatch<SetStateAction<PayrollInput>>
  result: PayrollResult
}

const ALIQUOTAS = [
  { value: "0.06", label: "6% — Simples (faixa inicial)" },
  { value: "0.09", label: "9% — Simples (faixa intermediária)" },
  { value: "0.1125", label: "11,25% — Simples + ISS" },
  { value: "0.15", label: "15% — Serviços (anexo V)" },
]

export function PjComparison({ input, setInput, result }: Props) {
  const economia = result.pj.economiaMensal
  const economiaPositiva = economia >= 0

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Comparativo rápido: CLT vs PJ</CardTitle>
        <CardDescription>
          No modelo PJ a empresa paga apenas o valor da nota fiscal, sem encargos trabalhistas nem
          benefícios obrigatórios. O imposto da nota fica a cargo do prestador.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pj-valor">Valor mensal pago ao PJ (nota fiscal)</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                R$
              </span>
              <Input
                id="pj-valor"
                type="number"
                min={0}
                step="0.01"
                value={Number.isFinite(input.pjValor) ? input.pjValor : ""}
                onChange={(e) =>
                  setInput((s) => ({ ...s, pjValor: Number.parseFloat(e.target.value) || 0 }))
                }
                className="pl-9 tabular-nums"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pj-aliquota">Imposto sobre a nota (Simples Nacional)</Label>
            <Select
              value={String(input.pjAliquota)}
              onValueChange={(v) => setInput((s) => ({ ...s, pjAliquota: Number.parseFloat(v) }))}
            >
              <SelectTrigger id="pj-aliquota" className="w-full">
                <SelectValue placeholder="Selecione a alíquota">
                  {(v: string) => ALIQUOTAS.find((a) => a.value === v)?.label ?? v}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ALIQUOTAS.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/70 p-4">
            <p className="text-xs font-medium text-muted-foreground">Custo CLT (empresa / mês)</p>
            <p className="mt-1 text-xl font-bold tabular-nums">{formatBRL(result.custoMensal)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatBRL(result.custoAnual)} / ano</p>
          </div>
          <div className="rounded-lg border border-border/70 p-4">
            <p className="text-xs font-medium text-muted-foreground">Custo PJ (empresa / mês)</p>
            <p className="mt-1 text-xl font-bold tabular-nums">{formatBRL(result.pj.custoMensal)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatBRL(result.pj.custoAnual)} / ano — sem encargos
            </p>
          </div>
        </div>

        {/* Detalhe do líquido do profissional PJ */}
        <div className="rounded-lg border border-border/70 p-4">
          <p className="mb-3 text-xs font-semibold text-foreground">O que recebe o profissional PJ</p>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Valor bruto da nota</dt>
              <dd className="font-medium tabular-nums">{formatBRL(result.pj.custoMensal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">
                Imposto da nota ({(result.pj.aliquota * 100).toFixed(2).replace(".", ",")}%)
              </dt>
              <dd className="font-medium tabular-nums text-destructive">
                - {formatBRL(result.pj.impostoMensal)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-border/70 pt-2">
              <dt className="font-semibold text-foreground">Líquido do profissional</dt>
              <dd className="font-bold tabular-nums text-positive">
                {formatBRL(result.pj.liquidoProfissional)}
              </dd>
            </div>
          </dl>
        </div>

        <div
          className={`flex items-center gap-3 rounded-lg p-4 ${
            economiaPositiva ? "bg-accent text-accent-foreground" : "bg-destructive/10 text-destructive"
          }`}
        >
          {economiaPositiva ? (
            <ArrowDownRight className="size-5 shrink-0" />
          ) : (
            <ArrowUpRight className="size-5 shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold">
              {economiaPositiva ? "Economia da empresa com PJ" : "Custo adicional com PJ"}:{" "}
              {formatBRL(Math.abs(economia))} / mês
            </p>
            <p className="text-xs opacity-80">
              {Math.abs(result.pj.economiaPercentual).toFixed(1)}% em relação ao CLT —{" "}
              {formatBRL(Math.abs(result.pj.economiaAnual))} por ano
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Atenção: a contratação PJ exige análise jurídica para evitar vínculo empregatício
          (pejotização). Os valores são estimativas para apoio à decisão.
        </p>
      </CardContent>
    </Card>
  )
}
