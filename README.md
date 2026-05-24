# Checklist para construção de sistemas de M&A subnacionais · CLEAR Lab

> *Recurso prático para gestores subnacionais brasileiros. Derivado do Guia de construção de sistemas de monitoramento e avaliação de políticas públicas — FGV CLEAR, 2026.*

![Status](https://img.shields.io/badge/status-v0.1-blue?style=flat-square)
![License](https://img.shields.io/badge/code-MIT-blue?style=flat-square)
![Content](https://img.shields.io/badge/conte%C3%BAdo-CC_BY_4.0-green?style=flat-square)
![CLEAR](https://img.shields.io/badge/FGV-CLEAR_Lab-1B3A5C?style=flat-square)

Página única em HTML estático, com dois modos de uso em abas separadas:

- **Parte A — Checklist estático.** As perguntas-orientadoras do Guia, organizadas nas cinco etapas de institucionalização. Pensado para impressão e uso em reunião.
- **Parte B — Diagnóstico iterativo.** As mesmas perguntas em formato respondível, com persistência em `localStorage`. Ao final, a página gera um diagnóstico organizado por etapa e aponta pontos de atenção a partir do padrão das respostas.

🔗 **Site:** https://caiodesouzacastro.github.io/clear-cartilha-sistemas-ma/

## As cinco etapas

| #     | Etapa                       | Foco                                        |
| ----- | --------------------------- | ------------------------------------------- |
| **I**   | Diagnóstico               | Mapear capacidades e necessidades         |
| **II**  | Desenho e concepção       | Definir o modelo                          |
| **III** | Arranjo normativo         | Tipos de formalização                     |
| **IV**  | Implementação             | Colocar o sistema em funcionamento        |
| **V**   | Uso e consolidação        | Garantir utilidade e sustentabilidade     |

## Como o diagnóstico interativo funciona

1. O usuário responde cada pergunta com um de quatro estados: **Já temos / Em construção / Ainda não / Não se aplica**.
2. As respostas são persistidas em `localStorage` (chave: `clear-cartilha-diagnostico-v1`).
3. Ao clicar em *Gerar diagnóstico*, a página calcula uma pontuação por etapa (ponderada: `ok=1.0`, `mid=0.5`, `no=0`, `na` sai do denominador) e roda um conjunto de regras simples para identificar padrões relevantes.
4. As regras geram **pontos de atenção** com referências explícitas ao Guia (capítulo correspondente, casos citados, autores referenciados).
5. O resultado pode ser **impresso** (CSS de print caprichado, imprime ambas as abas) ou **exportado em Markdown**.

Regras implementadas em `assets/js/diagnostico.js` (10 regras, todas baseadas em sinais explícitos do Guia):

- *Construindo sem ter diagnosticado* — etapa I vazia, II ou III preenchidas.
- *Risco de sistema de fachada* — desenho e implementação altos, uso baixo (Mackay 2007, Leeuw & Furubo 2008).
- *Implementação sem ancoragem normativa* — etapa IV alta, etapa III baixa (caso sul-africano).
- *Norma sem prática* — etapa III alta, etapa IV baixa (alerta sobre formalismo).
- *Muita coisa em construção* — mais da metade das respostas em "em construção".
- ... e mais 5 regras de mesma natureza.

## Estrutura

```
clear-cartilha-sistemas-ma/
├── index.html                    Parte A + Parte B em abas
├── assets/
│   ├── css/style.css             Design system CLEAR Lab — paleta azul
│   ├── js/diagnostico.js         Persistência, scoring, regras, export
│   └── pdf/guia-completo.pdf     (placeholder — substituir pelo PDF do Guia)
├── README.md
├── LICENSE
└── .gitignore
```

## Como rodar localmente

```bash
git clone https://github.com/caiodesouzacastro/clear-cartilha-sistemas-ma.git
cd clear-cartilha-sistemas-ma
python3 -m http.server 8000
# abra http://localhost:8000
```

Para publicar no GitHub Pages: **Settings → Pages → Source → main / (root)**.

## Design system

Compartilhado com os outros bens públicos do **CLEAR Lab**:

- 🔵 **Painel CLEAR** — https://caiodesouzacastro.github.io/painel-clear/
- 🔵 **Radar de Políticas Municipais** — https://caiodesouzacastro.github.io/radar-politicas-municipais/
- 🔵 **CLEAR Lab Prototypes** — https://caiodesouzacastro.github.io/clear-lab-prototypes/

Características:

- **Paleta**: azul institucional `#1B3A5C` como protagonista, com tonalidades complementares; acentos em itálico (Fraunces) ao invés de cor.
- **Fontes**: Fraunces (serifa, títulos), Inter (sans, corpo), JetBrains Mono (mono, labels).
- **Tom editorial**: numeração de seções, avisos epistemológicos em destaque, disclaimers honestos.
- **Dark mode** via `prefers-color-scheme`.
- **Print styles** otimizados para A4 (imprime as duas abas em sequência).

## Conexão com o Guia

Este checklist **depende do Guia**: não substitui leitura, não classifica em níveis de maturidade, não funciona como auditoria. Cada bloco do checklist remete ao capítulo correspondente do Guia para aprofundamento; cada ponto de atenção gerado pelo diagnóstico cita o lugar do Guia onde a questão é tratada com mais profundidade.

## Créditos

- **Conteúdo de origem:** *Guia de construção de sistemas de monitoramento e avaliação de políticas públicas* — FGV CLEAR (2026)
- **Desenho do instrumento e desenvolvimento:** **CLEAR Lab** · FGV EESP
- **Referências fundamentais** citadas no diagnóstico:
  - Mackay (2007) — *How to Build M&E Systems to Support Better Government*
  - Leeuw & Furubo (2008) — *Evaluation systems: what are they and why study them?*
  - Kusek & Rist (2004) — *Ten steps to a results-based monitoring and evaluation system*

## Repositórios irmãos

- 🔗 [Painel CLEAR](https://caiodesouzacastro.github.io/painel-clear/) — indicadores de políticas públicas brasileiras
- 🔗 [Radar de Políticas Municipais](https://caiodesouzacastro.github.io/radar-politicas-municipais/) — classificação automática de contratos PNCP
- 🔗 [CLEAR Lab Prototypes](https://caiodesouzacastro.github.io/clear-lab-prototypes/) — seis protótipos de bens públicos com IA

## Licença

- **Código:** MIT — veja [LICENSE](LICENSE).
- **Conteúdo (checklist, textos editoriais):** CC BY 4.0 — atribuição ao **CLEAR Lab · FGV EESP**.

---

*v0.1 · Volume 01 · Edição 01 · Maio 2026 · CLEAR Lab · FGV EESP*
