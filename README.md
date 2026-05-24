# CLEAR × TCE-ES · Checklist para construção de sistemas de M&A subnacionais

> **Convênio nº 00017/2024-4C** · FGV CLEAR e Tribunal de Contas do Estado do Espírito Santo
> *Instrumento prático derivado do Guia de construção de sistemas de monitoramento e avaliação de políticas públicas (FGV CLEAR, 2026)*

Página única em HTML estático, com dois modos de uso:

- **Parte A — Checklist estático.** As perguntas-orientadoras do Guia, organizadas nas cinco etapas de institucionalização. Pensado para impressão e uso em reunião.
- **Parte B — Diagnóstico iterativo.** As mesmas perguntas em formato respondível, com persistência em `localStorage`. Ao final, a página gera um diagnóstico organizado por etapa e aponta pontos de atenção a partir do padrão das respostas.

🔗 **Site:** https://caiodesouzacastro.github.io/clear-cartilha-sistemas-ma/

## As cinco etapas

| # | Etapa | Foco |
|---|---|---|
| **I**   | Diagnóstico                  | Mapear capacidades e necessidades |
| **II**  | Desenho e concepção          | Definir o modelo |
| **III** | Arranjo normativo            | Tipos de formalização |
| **IV**  | Implementação                | Colocar o sistema em funcionamento |
| **V**   | Uso e consolidação           | Garantir utilidade e sustentabilidade |

## Como o diagnóstico interativo funciona

1. O usuário responde cada pergunta com um de quatro estados: **Já temos / Em construção / Ainda não / Não se aplica**.
2. As respostas são persistidas em `localStorage` (chave: `clear-cartilha-diagnostico-v1`).
3. Ao clicar em *Gerar diagnóstico*, a página calcula uma pontuação por etapa (ponderada: `ok=1.0`, `mid=0.5`, `no=0`, `na` sai do denominador) e roda um conjunto de regras simples para identificar padrões relevantes.
4. As regras geram **pontos de atenção** com referências explícitas ao Guia (capítulo correspondente, casos citados, autores referenciados).
5. O resultado pode ser **impresso** (CSS de print caprichado) ou **exportado em Markdown**.

Exemplos de regras implementadas em `assets/js/diagnostico.js`:

- *"Construindo sem ter diagnosticado"* — etapa I vazia, mas II ou III preenchidas.
- *"Risco de sistema de fachada"* — desenho e implementação altos, uso baixo (referência a Mackay 2007, Leeuw & Furubo 2008).
- *"Implementação sem ancoragem normativa"* — etapa IV alta, etapa III baixa (referência ao caso sul-africano).
- *"Norma sem prática"* — etapa III alta, etapa IV baixa (alerta sobre formalismo).
- *"Muita coisa em construção"* — mais da metade das respostas em "em construção" (alerta sobre dispersão).

Total: ~10 regras, baseadas em sinais explícitos do Guia.

## Estrutura do repositório

```
clear-cartilha-sistemas-ma/
├── index.html                    ← Parte A + Parte B na mesma página
├── assets/
│   ├── css/style.css             ← Design system CLEAR + checklist + diagnóstico + print
│   ├── js/diagnostico.js         ← Persistência, scoring, regras de alerta, export
│   └── pdf/guia-completo.pdf     ← (placeholder — substituir pelo PDF oficial)
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

## Como publicar no GitHub Pages

1. Suba o repositório para o GitHub.
2. Settings → Pages → Source: `main` / `(root)`.
3. Aguarde alguns minutos e acesse `https://<usuario>.github.io/clear-cartilha-sistemas-ma/`.

## Design system

Compartilhado com os outros bens públicos do FGV CLEAR para o TCE-ES:
- **Paleta CLEAR** (azul, salmão, verde, âmbar, roxo)
- **Fontes:** Fraunces (serifa para títulos), Inter (sans para corpo), JetBrains Mono (mono para labels)
- **Tom editorial:** sério, com personalidade, parágrafos curtos, negritos pesados em frases-conceito
- **Dark mode** via `prefers-color-scheme`
- **Print styles** otimizados para A4

## Conexão com o Guia

Este checklist **depende do Guia**: não substitui leitura, não classifica em níveis de maturidade, não funciona como auditoria. Cada bloco do checklist remete ao capítulo correspondente do Guia para aprofundamento; cada ponto de atenção gerado pelo diagnóstico cita o lugar do Guia onde a questão é tratada com mais profundidade.

## Créditos

- **Conteúdo de origem:** *Guia de construção de sistemas de monitoramento e avaliação de políticas públicas* — FGV CLEAR (2026)
- **Desenho do instrumento e desenvolvimento web:** FGV CLEAR Lab
- **Referências fundamentais** mencionadas no diagnóstico:
  - Mackay (2007) — *How to Build M&E Systems to Support Better Government*
  - Leeuw & Furubo (2008) — *Evaluation systems: what are they and why study them?*
  - Kusek & Rist (2004) — *Ten steps to a results-based monitoring and evaluation system*
  - FGV CLEAR (2025) — *Diagnóstico dos sistemas de avaliação de políticas públicas no Brasil*

## Licença

- **Código:** MIT — veja [LICENSE](LICENSE).
- **Conteúdo do checklist e textos editoriais:** CC BY 4.0 — atribuição obrigatória ao FGV CLEAR / TCE-ES.

---

*Para mais protótipos e bens públicos do FGV CLEAR:*
- [Painel CLEAR](https://caiodesouzacastro.github.io/painel-clear/)
- [Radar de Políticas Municipais](https://caiodesouzacastro.github.io/radar-politicas-municipais/)
- [Teorias de Mudança Setoriais](https://caiodesouzacastro.github.io/clear-tdms-municipais/)
- [Mini-guia de práticas em M&A](https://caiodesouzacastro.github.io/clear-mini-guia-ma/)
- [CLEAR Lab Prototypes](https://caiodesouzacastro.github.io/clear-lab-prototypes/)
