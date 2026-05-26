# Como construir um sistema de M&A no meu município? · FGV CLEAR

> Instrumento de apoio à gestão pública. Checklist e diagnóstico para a construção de sistemas de monitoramento e avaliação em governos subnacionais brasileiros.

Derivado do **Guia FGV CLEAR de construção de sistemas de monitoramento e avaliação de políticas públicas** (2026). Convênio FGV CLEAR · TCE-ES nº 00017/2024-4C.

🔗 **Site:** https://caiodesouzacastro.github.io/clear-cartilha-sistemas-ma/

## Estrutura

Página única em HTML estático com três abas:

- **Introdução** — apresenta a ferramenta, as quatro etapas de uso, como interpretar o resultado, e as cinco etapas do Guia (com pergunta central de cada uma).
- **Checklist de etapas** — para imprimir e levar pra reunião. Cada bloco corresponde a uma das cinco etapas.
- **Diagnóstico do meu sistema** — formulário interativo com 36 perguntas. Persistência em `localStorage`, scoring por etapa, e geração de pontos de atenção via 9 regras baseadas no Guia.

## As cinco etapas

| #     | Etapa                    | Foco                                  |
| ----- | ------------------------ | ------------------------------------- |
| **I**   | Diagnóstico            | Mapear capacidades e necessidades     |
| **II**  | Desenho e concepção    | Definir o modelo                      |
| **III** | Arranjo normativo      | Tipos de formalização                 |
| **IV**  | Implementação          | Colocar o sistema em funcionamento    |
| **V**   | Uso e consolidação     | Garantir utilidade e sustentabilidade |

## Design system

Adota o template visual do checklist *"Que tipo de avaliação é viável para a minha política?"* (Michel Szklo / FGV CLEAR), para padronização visual entre os instrumentos da série.

- **Paleta**: navy `#01354A` + azul-claro `#08B0EE` + verde `#98C43B` (acentos).
- **Tipografia**: Fraunces (serif, títulos), DM Sans (sans-serif, corpo).
- **Logos**: FGV CLEAR + FGV EESP no header e no footer.
- Layout responsivo, com versão de impressão otimizada.

## Estrutura de arquivos

```
clear-cartilha-sistemas-ma/
├── index.html                    Página única (HTML+CSS+JS inline)
├── assets/img/
│   ├── logo-clear.png            FGV CLEAR
│   └── logo-fgv-eesp.png         FGV EESP
├── README.md
├── LICENSE
└── .gitignore
```

## Diagnóstico interativo — como funciona

1. Para cada pergunta, o usuário escolhe um de quatro estados:
   - **Já temos** (pontua 1,0)
   - **Em construção** (pontua 0,5)
   - **Ainda não** (pontua 0)
   - **Não se aplica** (sai do denominador)
2. As respostas são persistidas em `localStorage` (chave: `clear-checklist-ma-v2`).
3. O resultado é calculado em tempo real: pontuação por etapa (ponderada) + pontos de atenção gerados por 9 regras.
4. As regras incluem padrões como *"Construindo sem ter diagnosticado"* (etapa I vazia, II/III preenchidas), *"Risco de sistema de fachada"* (Mackay 2007, Leeuw & Furubo 2008), *"Norma sem prática"* (alerta sobre formalismo), entre outras.
5. O resultado pode ser impresso ou exportado em Markdown.

## Como rodar localmente

```bash
git clone https://github.com/caiodesouzacastro/clear-cartilha-sistemas-ma.git
cd clear-cartilha-sistemas-ma
python3 -m http.server 8000
# abra http://localhost:8000
```

Para publicar no GitHub Pages: **Settings → Pages → Source → main / (root)**.

## Como citar

> FGV CLEAR. *Como construir um sistema de M&A no meu município? Checklist e diagnóstico de etapas.* São Paulo: FGV CLEAR, 2026. Disponível em: `caiodesouzacastro.github.io/clear-cartilha-sistemas-ma`. Convênio FGV CLEAR · TCE-ES nº 00017/2024-4C.

## Bens públicos da série FGV CLEAR · TCE-ES

- **Teorias de Mudança Setoriais** — `caiodesouzacastro.github.io/clear-tdms-municipais/`
- **Mini-guia de práticas em M&A** — `caiodesouzacastro.github.io/clear-mini-guia-ma/`
- **Checklist de construção de sistemas de M&A** (este) — `caiodesouzacastro.github.io/clear-cartilha-sistemas-ma/`

## Licença

- **Código**: MIT — veja [LICENSE](LICENSE).
- **Conteúdo**: CC BY 4.0 — atribuição obrigatória ao FGV CLEAR.
