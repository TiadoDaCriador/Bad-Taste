# Recomendações — Bad Taste Portfolio

---

## 1. Bloqueadores Imediatos (conteúdo)

### Assets
- **Vídeos** — sem isto o conceito principal não funciona. Coloca os ficheiros em `public/videos/full/` e define `videoFull` + `previewStart` em `projects.js`
- **Thumbnails** — imagens estáticas para cada segmento do anel. Coloca em `public/images/` e define `thumbnail: '/images/nome.jpg'` em `projects.js`
- ✅ **Paths corretos** — corrigidos: `/images/foto.png`, não `/public/images/foto.png`

### Dados reais (`src/data/projects.js`)
- Preenche `title`, `slug`, `description` e `tags` reais para todos os projetos
- Remove os projetos placeholder (Beta, Gamma, Delta, Epsilon) quando tiveres os reais

### Logo
- Coloca qualquer SVG simples em `public/` e referencia no canto superior esquerdo da `HomePage.jsx` (atualmente é texto "BAD TASTE")

---

## 2. UX / Interação

### Transição de página
- ✅ Ao clicar num segmento: anel faz fade-out (300ms) antes de navegar para `/projeto/:slug`
- ✅ `ProjectPage`: fade-in ao montar, fade-out ao sair (300ms)
- ✅ Tecla **Esc** na `ProjectPage` volta à homepage

### Hover transparente
- ✅ Ao hover, o segmento torna-se transparente (fill + thumbnail dissolvem-se) — o vídeo de fundo é visível através do arco do anel

### Indicador de projeto ativo ao voltar
- ✅ Ao voltar de `/projeto/alpha`, o segmento Alpha fica com stroke mais espesso durante 1.5s

### Painel de info
- ✅ Contador `01 / 05` no canto do painel
- **Sugestão**: seta `→ PRÓXIMO` no painel para avançar para o próximo projeto sem clicar no anel — requer elevar o estado `hoveredIndex` para `HomePage`
- **Sugestão**: ao clicar no título do projeto no painel, navega para `/projeto/:slug` (alternativa ao clique no segmento)

### Scroll para navegar
- **Sugestão**: usar `wheel` event na homepage para avançar/recuar no anel (rotação discreta entre segmentos) — elimina a necessidade de mirar o segmento com o cursor

### Teclado
- **Sugestão**: setas ← → para navegar entre segmentos sem Tab; `Enter` para abrir o projeto
- Atual: Tab navega, Enter/Space abre

---

## 3. Performance

### Vídeos
- ✅ `preload="metadata"` implementado — carrega apenas ao hover
- Para mobile com dados limitados, considera `preload="none"` e só carregar ao segundo tap
- Converte vídeos para `.mp4` H.264 + `.webm` VP9 para compatibilidade e tamanho menor
- **Sugestão**: preload do vídeo do segmento adjacente enquanto o atual está a tocar (antecipa o próximo hover)

### Imagens
- Converte thumbnails para `.webp` — ~30% mais leve que PNG/JPG
- Tamanho recomendado: 600×600px basta (o segmento é pequeno)

### Rotação
- ✅ `cancelAnimationFrame` no cleanup implementado
- ✅ `visibilitychange` pausa o `requestAnimationFrame` quando o tab não está visível

---

## 4. Design

### Animação de entrada
- **Sugestão**: ao carregar a homepage pela primeira vez, o anel cresce de `scale(0)` para `scale(1)` com `ease-out` (~600ms) — dá impacto à entrada e estabelece o anel como elemento central
- **Sugestão**: o slideshow de fundo faz fade-in progressivo (de preto para as imagens) nos primeiros 1.5s

### Efeito de vidro no painel de info
- **Sugestão**: em vez do fundo `#eeece8` sólido, usar `backdrop-filter: blur(12px)` com `background: rgba(238,236,232,0.75)` — o vídeo de fundo é parcialmente visível atrás do painel

### Página de detalhe (`/projeto/:slug`)
- ✅ Vídeo em autoplay muted loop no topo (full-width)
- ✅ Título grande em caps com tracking generoso
- ✅ Design monochromático (sem dots de cor)
- **Sugestão**: galeria de imagens abaixo da descrição (grid 2–3 colunas) — adicionar `images: [...]` ao array de projetos
- **Sugestão**: botão/link para projeto ao vivo ou repositório (`url` + `repo` nos dados do projeto)
- **Sugestão**: navegação entre projetos na página de detalhe (← Anterior / Seguinte →) sem voltar à homepage

### Slideshow de fundo
- As 16 imagens atuais são genéricas — substitui por frames reais dos projetos quando tiveres conteúdo
- **Sugestão**: usar apenas thumbnails dos projetos no slideshow (elimina assets duplicados e cria coerência visual)

### Tipografia
- ✅ **Space Grotesk** definida via Google Fonts
- **Sugestão alternativa**: **Monument Extended** para os títulos na ProjectPage — reforça estética editorial mais pesada

---

## 5. Acessibilidade

- ✅ `aria-label`, `role="button"`, `tabIndex`, `onKeyDown` (Enter/Space) implementados
- ✅ `aria-current="true"` no segmento destacado ao voltar
- **Sugestão**: `prefers-reduced-motion` — verificar `window.matchMedia('(prefers-reduced-motion: reduce)')` e, se verdadeiro, desativar a rotação contínua do anel (parar ou reduzir para `NORMAL_SPEED = 0`)
- **Sugestão**: garantir que o contraste do texto no painel de info passa WCAG AA

---

## 6. Extras interessantes

### URL hash ao hover
- **Sugestão**: ao hover num segmento, atualizar o URL para `/#alpha` (sem navegar) — permite partilhar/bookmarkar o estado do hover; ao carregar com `#slug` na URL, o segmento correspondente fica ativo de imediato

### Cursor personalizado
- ✅ `cursor: crosshair` aplicado globalmente
- **Sugestão**: cursor custom SVG (ex: mira fina 20×20px) com `cursor: url(...)` — reforça identidade; requer ficheiro `.cur` ou SVG inline no CSS

### Sons
- **Sugestão**: som sutil (tick curto, ~50ms) ao entrar num segmento — desativado por padrão, opt-in com um botão de som no canto

### SEO / Partilha
- **Sugestão**: meta tags Open Graph em `index.html` (ou por rota) — thumbnail do projeto como preview ao partilhar o link em redes sociais

---

## 7. Deploy

### Vercel (recomendado)
```bash
npm run build
npx vercel
```
- Tempo: < 5 minutos
- Domínio custom gratuito

### Alternativas
- **Netlify** — drag & drop da pasta `dist/`
- **GitHub Pages** — requer `base: '/repo-name/'` no `vite.config.js`

---

## 8. Próximos Passos Concretos (por ordem)

1. Adicionar thumbnails e vídeos reais a todos os projetos
2. Preencher dados reais (títulos, descrições, tags)
3. Substituir texto "BAD TASTE" por logo SVG real
4. Adicionar `prefers-reduced-motion`
5. Adicionar galeria de imagens na ProjectPage
6. Deploy no Vercel
