# 🏛️ Operação Centurião — Sistema de Inteligência Estatística & Auditoria

O **Sistema Centurião** é uma plataforma de inteligência educacional e auditoria estatística desenvolvida sob medida para a preparação de concursos de alto rendimento (focado no edital CFO/Soldado PMBA). 

A plataforma resolve o problema da falta de direcionamento estratégico e desperdício de energia dos alunos, mapeando vulnerabilidades em tempo real e calculando índices dinâmicos de risco com base nos pesos oficiais da banca examinadora (UNEB).

---

##  Diferenciais Comerciais & Funcionalidades

*   **Painel de Comando Centralizado (Dashboard):** Visualização analítica em Neumorfismo de alta fidelidade para controle absoluto de métricas.
*   **Algoritmo de Risco UNEB Integrado:** Processamento automatizado com peso oficial de **1.25x** por disciplina[cite: 1]. O sistema categoriza o desempenho do usuário em 4 quadrantes críticos instantaneamente:
    *   🟢 **Zona de Aprovação (Seguro):** Domínio consolidado do conteúdo.
    *   🟡 **Zona de Alerta (Médio):** Necessidade de revisão imediata do tópico.
    *   🔴 **Zona de Corte (< 60pts):** Risco crítico de não classificação.
    *   ⚫ **Eliminação Direta:** Desempenho zerado na disciplina.
*   **Mapeamento de Edital Cirúrgico:** Cobertura modularizada de 12 disciplinas essenciais do edital, divididas por blocos de tópicos específicos.
*   **Auditoria de Vulnerabilidades Nativa:** Identificação cirúrgica por assunto, detalhando a taxa exata de acertos e falhas brutas.
*   **Exportação de Relatório PDF Nativo:** Motor de impressão otimizado via CSS/Media Queries para gerar documentos estruturados de auditoria física ou digital para mentores e alunos.

---

## Stack Tecnológica de Última Geração

O projeto foi construído utilizando as ferramentas mais modernas e performáticas do ecossistema de desenvolvimento global (Safra 2026):

*   **Frontend:** [React 19.2.3](https://react.dev/) & [Next.js 16.1.6](https://nextjs.org/) utilizando a arquitetura otimizada de **App Router**.
*   **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) para renderização visual ultra-rápida e interface responsiva[cite: 1].
*   **Linguagem:** [TypeScript 5](https://www.typescriptlang.org/) garantindo tipagem estrita (`strict: true`) e segurança de dados em tempo de compilação.
*   **Backend & Banco de Dados:** [Supabase](https://supabase.com/) integrado de forma nativa para autenticação, persistência de histórico e integridade relacional.

---

## 📦 Estrutura de Arquitetura do Projeto

```text
sistema-centuriao/
├── app/
│   ├── layout.tsx       # RootLayout e injeção de Metadados de Auditoria
│   ├── page.tsx         # Dashboard Principal (Métricas, Gráficos e Tabelas)
│   └── globals.css      # Configurações do Tailwind v4 e variáveis de Neumorfismo
├── public/              # Assets e vetores estáticos
├── supabase.ts          # Inicialização e configuração do cliente Supabase API
├── package.json         # Scripts de automação e gerenciamento de dependências
└── tsconfig.json        # Configurações avançadas do compilador TypeScript.

Inicialização Local 
Para rodar o projeto localmente na sua máquina de desenvolvimento, siga os passos abaixo:

1. Pré-requisitos
Certifique-se de ter o Node.js instalado em sua máquina.

2. Clonar o Repositório e Instalar Dependências
Bash
# Instalar os pacotes necessários especificados no package.json
npm install
3. Configurar as Variáveis de Ambiente (.env.local)
Crie um arquivo na raiz do projeto chamado .env.local e insira as chaves de conexão da sua instância do Supabase[cite: 1]:

Snippet de código
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
4. Executar em Modo de Desenvolvimento
Bash
npm run dev
Abra http://localhost:3000 no seu navegador para visualizar a plataforma operacional rodando em tempo real[cite: 2].

Informações de Governança e Propriedade Intelectual (IP)
Este software e sua lógica algorítmica proprietária são ativos tecnológicos sob regime de cessão de direitos e custódia comercial.

Arquiteto Líder: Gabriel de Almeida Santos Silva

Entidade de Controle: PoWV IP Holding Company

CNPJ Vinculado: 58.046.660/0001-93

Ano de Consolidação: 2026
