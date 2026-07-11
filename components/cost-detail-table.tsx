import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatBRL, type LinhaCusto, type PayrollResult } from "@/lib/payroll"

const CATEGORIA_LABEL: Record<LinhaCusto["categoria"], string> = {
  salario: "Salário",
  encargos: "Encargo",
  beneficios: "Benefício",
}

const CATEGORIA_CLASS: Record<LinhaCusto["categoria"], string> = {
  salario: "bg-[var(--chart-1)]/10 text-[var(--chart-1)]",
  encargos: "bg-[var(--chart-2)]/15 text-[var(--chart-2)]",
  beneficios: "bg-[var(--chart-3)]/15 text-[var(--chart-3)]",
}

export function CostDetailTable({ result }: { result: PayrollResult }) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Detalhamento linha a linha</CardTitle>
        <CardDescription>Tudo o que compõe o custo mensal da contratação.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="hidden sm:table-cell">Tipo</TableHead>
              <TableHead className="text-right">Valor mensal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.linhas.map((linha) => (
              <TableRow key={linha.id}>
                <TableCell>
                  <div className="font-medium text-foreground">{linha.rotulo}</div>
                  <div className="text-xs text-muted-foreground">{linha.descricao}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORIA_CLASS[linha.categoria]}`}
                  >
                    {CATEGORIA_LABEL[linha.categoria]}
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatBRL(linha.valor)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2 border-border bg-muted/40 hover:bg-muted/40">
              <TableCell className="font-bold text-foreground">Custo mensal total</TableCell>
              <TableCell className="hidden sm:table-cell" />
              <TableCell className="text-right text-base font-bold tabular-nums text-primary">
                {formatBRL(result.custoMensal)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
