# 📊 custocertoRH - Calculadora Avançada CLT vs PJ

O **custocertoRH** é uma aplicação interativa desenvolvida para apoiar profissionais, profissionais de Recursos Humanos e gestores na tomada de decisão analítica e financeira ao comparar contratações nos formatos CLT (Consolidação das Leis do Trabalho) e PJ (Pessoa Jurídica). 

A ferramenta realiza simulações em tempo real com base na legislação fiscal e trabalhista brasileira, entregando clareza sobre o custo real de um colaborador e a receita líquida final de um prestador de serviços.

🔗 **Acesse a aplicação rodando ao vivo:** [https://calculadora-clt-vs-pj.vercel.app](https://calculadora-clt-vs-pj.vercel.app)

---

## 🛠️ Engenharia de Prompt & Desenvolvimento Dinâmico

Este projeto foi concebido e estruturado através de técnicas avançadas de **Engenharia de Prompt**, utilizando modelos de Inteligência Artificial de última geração (v0 / LLMs) para a geração do código e arquitetura de componentes.

O processo de desenvolvimento envolveu:
* **Contextualização de Regras de Negócio:** Tradução de legislações complexas de contratação em escopos lógicos inteligíveis pela IA.
* **Refinamento Iterativo (Few-Shot & Role-Playing):** Uso de personas de especialistas em desenvolvimento de software e contabilidade corporativa para refinar os cálculos e a interface do usuário.
* **Modularização:** Instrução focada na criação de componentes isolados, limpos e reutilizáveis utilizando metodologias modernas do ecossistema Web.

---

## 💼 Regras de Negócio & Cálculos Suportados

A aplicação processa múltiplos indicadores financeiros simultâneos para garantir precisão nas estimativas:

### 📑 Cenário CLT
* **Cálculo de Descontos Obrigatórios:** Dedução progressiva de INSS e IRRF direto na fonte.
* **Benefícios e Provisões:** Computação automatizada de 13º salário, férias profissionais, terço constitucional de férias e o impacto do recolhimento mensal de **FGTS**.
* **Benefícios Opcionais:** Inclusão parametrizada de Vale Transporte (VT), Vale Refeição/Alimentação (VR/VA) e Plano de Saúde.

### 🏢 Cenário PJ (Prestador de Serviços)
* **Tributação por Anexo:** Estruturação baseada em estimativas de impostos para microempresas e profissionais autônomos.
* **Custo Operacional:** Consideração de custos de contabilidade e taxas de manutenção empresarial.
* **Prospecção de Pró-Labore:** Dedução estimada para a retirada de Pró-Labore e recolhimento de INSS do sócio.

---

## 🚀 Tecnologias Utilizadas

A stack do projeto conta com ferramentas modernas do mercado que prezam por performance e interface fluida:

* **Framework:** [Next.js](https://nextjs.org/) (React)
* **Estilização & Componentes:** Tailwind CSS & Shadcn/ui
* **Gráficos Dinâmicos:** Recharts (para visualização analítica dos custos e quebras de valores)
* **Hospedagem & Deploy:** [Vercel](https://vercel.com/) com integração contínua (CI/CD) via GitHub.

---

## 🛠️ Como rodar o projeto localmente

Caso queira clonar este repositório e executar o projeto na sua máquina:

1. Clone o repositório:
```bash
git clone https://github.com/kelevramatt1-hash/custocertoRH.git
```
2. Instale as dependências:
```bash
pnpm install
```
3. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```
Abra o navegador e acesse: http://localhost:3000
