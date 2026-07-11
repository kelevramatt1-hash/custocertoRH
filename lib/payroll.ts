export type Regime = "simples" | "presumido" | "real"

export interface Beneficio {
  enabled: boolean
  valor: number
}

export interface PayrollInput {
  regime: Regime
  salario: number
  valeTransporte: Beneficio
  valeRefeicao: Beneficio
  assistenciaMedica: Beneficio
  encargos: {
    fgts: boolean
    decimoTerceiro: boolean
    ferias: boolean
  }
  /** Valor bruto mensal pago na nota fiscal do PJ */
  pjValor: number
  /** Alíquota de imposto sobre a nota fiscal de serviços do PJ (ex.: 0.06 = 6%) */
  pjAliquota: number
}

export interface LinhaCusto {
  id: string
  rotulo: string
  descricao: string
  valor: number
  categoria: "salario" | "encargos" | "beneficios"
}

export interface PayrollResult {
  linhas: LinhaCusto[]
  salarioBase: number
  totalEncargos: number
  totalBeneficios: number
  custoMensal: number
  custoAnual: number
  multiplicador: number
  categorias: { salario: number; encargos: number; beneficios: number }
  pj: {
    /** Custo da empresa com o PJ (valor bruto da nota, sem encargos) */
    custoMensal: number
    custoAnual: number
    /** Imposto retido/pago sobre a nota fiscal */
    impostoMensal: number
    aliquota: number
    /** Valor líquido que efetivamente fica com o profissional PJ */
    liquidoProfissional: number
    economiaMensal: number
    economiaAnual: number
    economiaPercentual: number
  }
}

export const REGIME_LABEL: Record<Regime, string> = {
  simples: "Simples Nacional",
  presumido: "Lucro Presumido",
  real: "Lucro Real",
}

const DESCONTO_VT = 0.06 // 6% do salário descontado do colaborador
const FGTS_ALIQUOTA = 0.08
const INSS_PATRONAL = 0.2
const RAT = 0.02
const TERCEIROS = 0.058

export function calcularCusto(input: PayrollInput): PayrollResult {
  const { regime, salario, encargos } = input
  const linhas: LinhaCusto[] = []

  // Salário base
  linhas.push({
    id: "salario",
    rotulo: "Salário Bruto",
    descricao: "Remuneração mensal contratada",
    valor: salario,
    categoria: "salario",
  })

  // ---- Encargos ----
  // FGTS mensal: 8% do salário bruto
  const fgts = encargos.fgts ? salario * FGTS_ALIQUOTA : 0

  // Provisão de 13º: salário / 12 (+ 8% de FGTS proporcional)
  const prov13 = encargos.decimoTerceiro ? salario / 12 : 0
  const fgts13 = encargos.decimoTerceiro && encargos.fgts ? prov13 * FGTS_ALIQUOTA : 0

  // Provisão de férias: (salário / 12) * 1,333 (+ 8% de FGTS proporcional)
  const provFerias = encargos.ferias ? (salario / 12) * 1.333 : 0
  const fgtsFerias = encargos.ferias && encargos.fgts ? provFerias * FGTS_ALIQUOTA : 0

  // INSS patronal: 0 no Simples; 20% + 2% RAT + 5,8% Terceiros nos demais
  const aplicaPatronal = regime !== "simples"
  const inssPatronal = aplicaPatronal ? salario * INSS_PATRONAL : 0
  const rat = aplicaPatronal ? salario * RAT : 0
  const terceiros = aplicaPatronal ? salario * TERCEIROS : 0

  if (encargos.fgts) {
    linhas.push({
      id: "fgts",
      rotulo: "FGTS (8%)",
      descricao: "Depósito mensal do Fundo de Garantia",
      valor: fgts,
      categoria: "encargos",
    })
  }
  if (encargos.decimoTerceiro) {
    linhas.push({
      id: "decimo",
      rotulo: "Provisão 13º (1/12)",
      descricao: "Um doze avos do salário provisionado por mês",
      valor: prov13,
      categoria: "encargos",
    })
  }
  if (fgts13 > 0) {
    linhas.push({
      id: "fgts-13",
      rotulo: "FGTS sobre 13º (8%)",
      descricao: "FGTS proporcional incidente sobre o 13º",
      valor: fgts13,
      categoria: "encargos",
    })
  }
  if (encargos.ferias) {
    linhas.push({
      id: "ferias",
      rotulo: "Provisão Férias + 1/3 (1/12 × 1,333)",
      descricao: "Férias mais o terço constitucional",
      valor: provFerias,
      categoria: "encargos",
    })
  }
  if (fgtsFerias > 0) {
    linhas.push({
      id: "fgts-ferias",
      rotulo: "FGTS sobre Férias (8%)",
      descricao: "FGTS proporcional incidente sobre as férias",
      valor: fgtsFerias,
      categoria: "encargos",
    })
  }
  if (aplicaPatronal) {
    linhas.push({
      id: "inss",
      rotulo: "INSS Patronal (20%)",
      descricao: "Contribuição previdenciária da empresa",
      valor: inssPatronal,
      categoria: "encargos",
    })
    linhas.push({
      id: "rat",
      rotulo: "RAT (2%)",
      descricao: "Risco Ambiental do Trabalho",
      valor: rat,
      categoria: "encargos",
    })
    linhas.push({
      id: "terceiros",
      rotulo: "Terceiros / Sistema S (5,8%)",
      descricao: "Contribuições a terceiros (INCRA, SESI, SENAI, etc.)",
      valor: terceiros,
      categoria: "encargos",
    })
  }

  // ---- Benefícios ----
  const vtBruto = input.valeTransporte.enabled ? input.valeTransporte.valor : 0
  const vtDesconto = Math.min(vtBruto, salario * DESCONTO_VT)
  const vtCusto = Math.max(0, vtBruto - vtDesconto)
  const vr = input.valeRefeicao.enabled ? input.valeRefeicao.valor : 0
  const saude = input.assistenciaMedica.enabled ? input.assistenciaMedica.valor : 0

  if (input.valeTransporte.enabled) {
    linhas.push({
      id: "vt",
      rotulo: "Vale Transporte",
      descricao: "Custo líquido (desconto de até 6% do salário)",
      valor: vtCusto,
      categoria: "beneficios",
    })
  }
  if (input.valeRefeicao.enabled) {
    linhas.push({
      id: "vr",
      rotulo: "Vale Refeição / Alimentação",
      descricao: "Benefício mensal concedido",
      valor: vr,
      categoria: "beneficios",
    })
  }
  if (input.assistenciaMedica.enabled) {
    linhas.push({
      id: "saude",
      rotulo: "Assistência Médica",
      descricao: "Plano de saúde custeado pela empresa",
      valor: saude,
      categoria: "beneficios",
    })
  }

  const totalEncargos =
    fgts + prov13 + fgts13 + provFerias + fgtsFerias + inssPatronal + rat + terceiros
  const totalBeneficios = vtCusto + vr + saude
  const custoMensal = salario + totalEncargos + totalBeneficios
  const custoAnual = custoMensal * 12
  const multiplicador = salario > 0 ? custoMensal / salario : 0

  // ---- Simulação PJ ----
  // A empresa paga o valor bruto da nota (sem encargos trabalhistas).
  // O profissional arca com o imposto da nota fiscal (Simples: ~6% a 15%).
  const pjMensal = input.pjValor
  const aliquota = input.pjAliquota
  const impostoMensal = pjMensal * aliquota
  const liquidoProfissional = pjMensal - impostoMensal
  const economiaMensal = custoMensal - pjMensal
  const economiaPercentual = custoMensal > 0 ? (economiaMensal / custoMensal) * 100 : 0

  return {
    linhas,
    salarioBase: salario,
    totalEncargos,
    totalBeneficios,
    custoMensal,
    custoAnual,
    multiplicador,
    categorias: { salario, encargos: totalEncargos, beneficios: totalBeneficios },
    pj: {
      custoMensal: pjMensal,
      custoAnual: pjMensal * 12,
      impostoMensal,
      aliquota,
      liquidoProfissional,
      economiaMensal,
      economiaAnual: economiaMensal * 12,
      economiaPercentual,
    },
  }
}

export function formatBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(valor || 0)
}
