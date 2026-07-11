"use client"

import type { Dispatch, SetStateAction } from "react"
import { Calculator } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { REGIME_LABEL, type PayrollInput, type Regime } from "@/lib/payroll"

interface Props {
  input: PayrollInput
  setInput: Dispatch<SetStateAction<PayrollInput>>
  onCalcular: () => void
}

function MoneyInput({
  id,
  value,
  onChange,
  disabled,
  prefix = "R$",
}: {
  id: string
  value: number
  onChange: (v: number) => void
  disabled?: boolean
  prefix?: string
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        {prefix}
      </span>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        step="0.01"
        disabled={disabled}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(Number.parseFloat(e.target.value) || 0)}
        className="pl-9 tabular-nums"
      />
    </div>
  )
}

export function CostInputForm({ input, setInput, onCalcular }: Props) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Dados da contratação</CardTitle>
        <CardDescription>Preencha os parâmetros para calcular o custo real CLT.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Regime */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="regime">Regime tributário da empresa</Label>
          <Select
            value={input.regime}
            onValueChange={(v: Regime) => setInput((s) => ({ ...s, regime: v }))}
          >
            <SelectTrigger id="regime" className="w-full">
              <SelectValue placeholder="Selecione o regime">
                {(v: string) => REGIME_LABEL[v as Regime]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simples">Simples Nacional</SelectItem>
              <SelectItem value="presumido">Lucro Presumido</SelectItem>
              <SelectItem value="real">Lucro Real</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            No Simples Nacional o INSS patronal já está incluso no DAS.
          </p>
        </div>

        {/* Salário */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="salario">Salário bruto pretendido</Label>
          <MoneyInput
            id="salario"
            value={input.salario}
            onChange={(v) => setInput((s) => ({ ...s, salario: v }))}
          />
        </div>

        <Separator />

        {/* Benefícios */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-foreground">Benefícios</h3>

          <BenefitRow
            id="vt"
            label="Vale Transporte"
            checked={input.valeTransporte.enabled}
            onCheck={(c) =>
              setInput((s) => ({ ...s, valeTransporte: { ...s.valeTransporte, enabled: c } }))
            }
            value={input.valeTransporte.valor}
            onValue={(v) =>
              setInput((s) => ({ ...s, valeTransporte: { ...s.valeTransporte, valor: v } }))
            }
          />
          <BenefitRow
            id="vr"
            label="Vale Refeição / Alimentação"
            checked={input.valeRefeicao.enabled}
            onCheck={(c) =>
              setInput((s) => ({ ...s, valeRefeicao: { ...s.valeRefeicao, enabled: c } }))
            }
            value={input.valeRefeicao.valor}
            onValue={(v) =>
              setInput((s) => ({ ...s, valeRefeicao: { ...s.valeRefeicao, valor: v } }))
            }
          />
          <BenefitRow
            id="saude"
            label="Assistência Médica"
            checked={input.assistenciaMedica.enabled}
            onCheck={(c) =>
              setInput((s) => ({
                ...s,
                assistenciaMedica: { ...s.assistenciaMedica, enabled: c },
              }))
            }
            value={input.assistenciaMedica.valor}
            onValue={(v) =>
              setInput((s) => ({ ...s, assistenciaMedica: { ...s.assistenciaMedica, valor: v } }))
            }
          />
        </div>

        <Separator />

        {/* Encargos */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">Encargos e provisões</h3>
          <EncargoToggle
            id="fgts"
            label="FGTS (8%)"
            checked={input.encargos.fgts}
            onCheck={(c) => setInput((s) => ({ ...s, encargos: { ...s.encargos, fgts: c } }))}
          />
          <EncargoToggle
            id="decimo"
            label="Provisão de 13º salário"
            checked={input.encargos.decimoTerceiro}
            onCheck={(c) =>
              setInput((s) => ({ ...s, encargos: { ...s.encargos, decimoTerceiro: c } }))
            }
          />
          <EncargoToggle
            id="ferias"
            label="Provisão de Férias + 1/3 constitucional"
            checked={input.encargos.ferias}
            onCheck={(c) => setInput((s) => ({ ...s, encargos: { ...s.encargos, ferias: c } }))}
          />
        </div>

        <Button size="lg" className="mt-2 w-full gap-2 text-sm font-semibold" onClick={onCalcular}>
          <Calculator className="size-4" />
          Calcular Custo Real
        </Button>
      </CardContent>
    </Card>
  )
}

function BenefitRow({
  id,
  label,
  checked,
  onCheck,
  value,
  onValue,
}: {
  id: string
  label: string
  checked: boolean
  onCheck: (c: boolean) => void
  value: number
  onValue: (v: number) => void
}) {
  return (
    <div className="rounded-lg border border-border/70 p-3">
      <div className="flex items-center gap-3">
        <Checkbox id={id} checked={checked} onCheckedChange={(c) => onCheck(Boolean(c))} />
        <Label htmlFor={id} className="flex-1 cursor-pointer font-normal">
          {label}
        </Label>
      </div>
      {checked && (
        <div className="mt-3 pl-7">
          <MoneyInput id={`${id}-valor`} value={value} onChange={onValue} />
        </div>
      )}
    </div>
  )
}

function EncargoToggle({
  id,
  label,
  checked,
  onCheck,
}: {
  id: string
  label: string
  checked: boolean
  onCheck: (c: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={(c) => onCheck(Boolean(c))} />
      <Label htmlFor={id} className="cursor-pointer font-normal">
        {label}
      </Label>
    </div>
  )
}
