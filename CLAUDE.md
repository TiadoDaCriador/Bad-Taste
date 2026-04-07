# Bad Taste — Portfolio Interativo

## Visão Geral

Website de portfólio pessoal com uma experiência visual minimalista e dinâmica. A homepage é dominada por um anel rotativo (donut/annular), dividido em segmentos — cada segmento representa um projeto.

## Conceito Principal

### Anel Rotativo (Homepage)
- Um anel fino (donut/annular) ocupa o centro do ecrã — sem texto nos segmentos
- Divide-se em N segmentos iguais (um por projeto), separados por gaps finos
- **O anel cresce automaticamente**: basta adicionar um projeto ao array — o anel recalcula `360° / n` segmentos
- Roda continuamente em loop, de forma suave e constante
- Ao hover/tap num segmento:
  - A rotação abranda progressivamente
  - O segmento torna-se **transparente** (o fill/thumbnail dissolvem-se, o vídeo do fundo é visível através do arco)
  - O vídeo do projeto aparece em full-screen no fundo (fade suave, substitui o slideshow)
  - Surge uma caixa de info (canto inferior direito) com título, descrição, tags e contador `01 / N`
- Ao retirar o hover, a rotação retoma gradualmente
- Mobile: primeiro tap seleciona (preview), segundo tap navega para o projeto
- Ao clicar: o anel faz fade-out (300ms) antes de navegar — transição suave
- Ao voltar da página de detalhe: o segmento correspondente fica brevemente destacado (stroke mais espesso, 1.5s)

### Filosofia de Design
- Minimalista, sem cor decorativa; tipografia **Space Grotesk** em caps, letra fina, espacejamento generoso
- **Dual-theme**: HomePage/ProjectPage/ContactsPage usam fundo bege (`#eeece8`); VideoPage/PhotosPage/GalleryPage usam fundo dark (`#111`) — estética editorial
- Cards de vídeo/foto: imagem limpa por defeito, **sem texto visível**; hover revela overlay escuro + info (fade + translateY)
- Segmentos do anel: thumbnail ao hover dissolve-se revelando vídeo por baixo; segmentos vazios ficam transparentes
- Vídeos de preview (clip 20s) full-screen no fundo ao hover no anel (substituem slideshow)
- Slideshow corre continuamente sem hover; pausa ao hover

## Stack Técnica
- Frontend: **React + Vite**
- Backend: **Express.js + Multer** (porta 3001, paralelo ao Vite 5173)
- Animações: **requestAnimationFrame** (sem dependências externas)
- Anel/segmentos: **SVG** com paths annulares calculados geometricamente
- Routing: **react-router-dom** v6
- Styling: **CSS inline** (sem framework)
- i18n: **contexto React custom** (sem dependências externas) — ES / CA / EN
- Dados: **localStorage** para projetos/contactos; **gallery.json** (servidor) para galeria
- Admin: auth por password via `VITE_ADMIN_PASSWORD` ou palavra-passe customizada em `localStorage`; upload de ficheiros via Multer
- Upload: **Multer** para vídeos (`/videos/full/`) e fotos (`/images/`)

## Estrutura de Ficheiros
```
server/
  index.js                  — Express app, rotas, middleware CORS/security
  routes/
    upload.js               — POST /api/upload/photo, POST /api/upload/video (Multer)
    gallery.js              — GET/POST/PUT/DELETE /api/gallery (CRUD da galeria)
  data/
    gallery.json            — persistência de fotos: [{id, path, caption, order, createdAt}]

src/
  admin/
    adminData.js            — getProjects/saveProjects, getContacts/saveContacts (localStorage)
                              slugify()
    adminAuth.js            — login/logout/isAuthenticated/changePassword (sessionStorage + localStorage)
    galleryData.js          — getGallery, uploadPhoto, uploadVideo, addGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto, setCoverPhoto (API)
  data/projects.js          — array de projetos estático (fallback inicial)
  i18n/
    translations.js         — traduções: UI + títulos/descrições/tags (ES/CA/EN) + fotos
    LanguageContext.jsx     — LanguageProvider + hook useLanguage()
  components/
    RotatingWheel.jsx       — anel SVG rotativo + hover/velocidade
    VideoPreview.jsx        — caixa de info (título, descrição, tags, contador)
    BackgroundSlideshow.jsx — slideshow de fundo com crossfade
    ContactsFooter.jsx      — footer partilhado (#111, brand + nav + contactos) usado em HomePage/VideoPage/PhotosPage/GalleryPage
  pages/
    HomePage.jsx            — homepage: navbar + anel + slideshow + footer
    ProjectPage.jsx         — página de detalhe /projeto/:slug
    ContactsPage.jsx        — página /contactos (fundo preto, Esc volta)
    VideoPage.jsx           — página /video: grid 2 colunas, texto centrado nos cards, back button, footer
    PhotosPage.jsx          — página /fotos: card de capa com nome centrado (hover) → /fotos/galeria, back button, footer
    GalleryPage.jsx         — página /fotos/galeria: grid completo de fotos + lightbox, back button, footer
    admin/
      AdminLogin.jsx        — login (/admin)
      AdminDashboard.jsx    — painel (/admin/dashboard): projetos + galeria + segurança (pw) + contactos
      AdminProjectEditor.jsx — editor (/admin/projects/:slug): upload de thumbnail, videoFull, videoPreview
  styles/
    global.css              — reset + variáveis de cor

public/
  videos/
    full/                   — vídeos completos (uploadados via Multer)
  images/                   — imagens: slideshow (16 fixas) + galeria (uploadadas via Multer)

.env                        — VITE_ADMIN_PASSWORD
.env.example                — template público
package.json                — scripts: dev (Vite+Express), dev:frontend, server
vite.config.js              — proxy /api → localhost:3001
```

## Constantes do Anel (RotatingWheel.jsx)
- `R_OUTER = 300` — raio exterior
- `R_INNER = 245` — raio interior (anel fino, ~55px de espessura)
- `GAP_DEG = 1.2` — gap em graus entre segmentos
- `NORMAL_SPEED = 0.25` — graus por frame em rotação normal
- `SLOW_SPEED = 0.015` — graus por frame no hover/tap
- Interpolação de velocidade: `speed += (target - speed) * 0.035` por frame
- Sem texto nos segmentos — títulos aparecem apenas no painel VideoPreview

## Camada de Dados Admin (`src/admin/adminData.js`)
- Todas as páginas públicas (HomePage, ProjectPage, VideoPage, ContactsPage) lêem de `getProjects()` / `getContacts()` — **não** importam diretamente `data/projects.js`
- `getProjects()` — retorna array do localStorage (`bt_admin_projects`) ou fallback para `data/projects.js`
- `saveProjects(arr)` — persiste em localStorage
- `getContacts()` — retorna objeto `{email, instagram, instagramUrl, phone}` do localStorage (`bt_admin_contacts`) ou defaults
- `saveContacts(obj)` — persiste em localStorage
- `slugify(text)` — gera slug a partir de texto (remove acentos, substitui espaços por `-`)
- Para ligar a backend: substituir implementação de `getProjects`/`saveProjects` por chamadas API — interface mantém-se

## API Backend (`server/`)
- Rota `/api/upload/photo` — `POST` (Multer) → salva em `public/images/` → retorna `{path, filename}`
- Rota `/api/upload/video` — `POST` (Multer) → salva em `public/videos/full/` → retorna `{path, filename}`
- Rota `/api/gallery` — `GET` lista fotos | `POST` adiciona foto
- Rota `/api/gallery/:id` — `PUT` edita caption/order/isCover | `DELETE` apaga + remove ficheiro
  - `isCover: true` limpa automaticamente `isCover` de todas as outras fotos (só uma capa de cada vez)
- Servidor roda na **porta 3001** (paralelo ao Vite 5173)
- CORS configurado para `localhost:5173` e `localhost:3000`
- Vite proxy: `/api` → `localhost:3001`

## Galeria de Fotos
- Dados persistidos em `server/data/gallery.json`: `[{id, path, caption, order, isCover, createdAt}, ...]`
- Cada foto tem `id` (UUID), `path` (ex: `/images/1234-foto.jpg`), `caption`, `order`, `isCover` (boolean)
- Upload: seleciona ficheiro no admin → `POST /api/upload/photo` → retorna path → `POST /api/gallery` adiciona à galeria
- **Foto de capa** (`isCover: true`): a foto marcada como capa aparece na página `/fotos` como card de entrada
  - O `caption` da foto capa é o nome visível no card (centrado, em hover)
  - No admin: botão `☆ CAPA / ★ CAPA` por card; `setCoverPhoto(id)` chama PUT com `{isCover: true}`
- Página `/fotos` — card de capa (estilo VideoPage: 16/9, texto centrado, overlay escuro); clicar → `/fotos/galeria`
- Página `/fotos/galeria` — grid completo de fotos (auto-fill, 3 col → 2 tablet → 1 mobile) + lightbox
- Lightbox: overlay escuro, setas (◂ ›), Esc fecha (volta ao grid), counter `01/N`, caption exibida
- Apagar foto: `DELETE /api/gallery/:id` remove do JSON + ficheiro do disco

## Painel de Admin
- Rota `/admin` — login (password via `VITE_ADMIN_PASSWORD` no `.env`, default: `badtaste2026`, ou palavra-passe customizada em `localStorage(bt_admin_custom_password)`)
- Rota `/admin/dashboard` — **ORDEM: Projetos → Galeria → Segurança → Contactos**
  - Lista de projetos com reordenação (▲▼), editar, apagar
  - **Gestão de galeria**: grid responsivo, botão `☆/★ CAPA` por foto, caption editável, apagar com confirmação, botão "VER GALERIA"
  - **Segurança**: formulário para alterar palavra-passe (verifica atual, mínimo 6 chars, confirmação)
  - Edição de contactos (email, Instagram handle, Instagram URL, telemóvel)
- Rota `/admin/projects/novo` — criar novo projeto
- Rota `/admin/projects/:slug` — editar projeto existente
- **Upload direto**: botões de file input em AdminProjectEditor para thumbnail, videoFull, videoPreview → com loading state
- Auth: sessionStorage (`bt_admin_auth`); perde-se ao fechar o tab
- Palavra-passe customizada: guardada em `localStorage(bt_admin_custom_password)`; sobrepõe-se ao `.env`
- Design: fundo `#111`, tema escuro, mesma tipografia Space Grotesk

## Dados dos Projetos (`src/data/projects.js`)
Cada projeto tem:
- `title` — nome do projeto
- `slug` — identificador para URL
- `color` — cor reservada (usada futuramente; atualmente não usada no anel)
- `videoFull` — path para o vídeo completo (ex: `/videos/full/alpha.mp4`)
- `previewStart` — segundo de início do clip de 20s automático (ex: `45` = começa aos 0:45; `0` = início)
- `videoPreview` — (opcional) ficheiro de preview separado; se definido, sobrepõe-se ao clip automático
- `thumbnail` — (opcional) path para imagem estática do projeto (ex: `/images/alpha-thumb.jpg`); aparece no segmento do anel; ao hover dissolve-se (fica transparente, revelando o vídeo de fundo)
- `description` — texto descritivo
- `tags` — categorias/tecnologias

### Paths de assets
- Paths em `public/` devem começar com `/` (sem `/public/` no path): ex. `/images/foto.png`, `/videos/full/video.mp4`
- O prefixo `/public/` é inválido em Vite — Vite serve `public/` na raiz

### Lógica de Preview de Vídeo (BackgroundSlideshow.jsx)
- **Clip automático**: usa `videoFull` + `previewStart` — não precisa de ficheiro separado
- Toca 20 segundos a partir de `previewStart`; quando atinge `previewStart + 20s`, volta ao início do clip
- `preload="metadata"` — só carrega metadados ao hover, não o vídeo completo
- Se `videoPreview` estiver definido, tem prioridade sobre o clip automático
- Constante `CLIP_DURATION = 20` em `BackgroundSlideshow.jsx`
- Prop `videoProject` — quando definido, faz fade-in do vídeo full-screen (substitui o slideshow)

## Responsividade (Fluid Design)
- **Técnica principal**: `clamp(min, preferido, max)` em todas as dimensões (font-size, padding, margin, gaps)
  - Exemplo: `font-size: clamp(12px, 1.5vw, 13px)` — escala entre 12px-13px baseado em viewport
  - Exemplo: `padding: clamp(1rem, 3vw, 2rem)` — escala entre 1rem-2rem baseado em viewport
- **Sem breakpoints abruptos**: layout flui naturalmente entre mobile/tablet/desktop
- **Aplicado a todas as páginas**:
  - HomePage: navbar (logo, gaps, altura), footer grid (`auto-fit`)
  - VideoPage: navbar, grid 2 col (desktop) → 1 col (mobile via media query), cards responsivos
  - PhotosPage: card de capa responsivo, navbar responsiva
  - GalleryPage: grid auto-fill → 2 col (tablet) → 1 col (mobile), lightbox responsivo
  - ProjectPage: back button, vídeo, conteúdo, títulos
  - ContactsPage: header flexível, layout 2 col → 1 col em mobile (media query), formulário
  - AdminDashboard: tabela com scrolling, inputs, buttons, espaçamento
- **Benefício**: tipografia e espaçamento sempre legível/proporcional, sem saltos de tamanho

## BackgroundSlideshow (`src/components/BackgroundSlideshow.jsx`)
- Dois slots alternados (A/B) com `backgroundImage` CSS — crossfade suave sem flash
- `SHOW_DURATION = 3000ms` — tempo por imagem
- `FADE_DURATION = 900ms` — duração do crossfade
- Prop `paused` — quando `true`, o intervalo não avança (imagem actual fica congelada)
- Prop `videoProject` — quando definido, faz fade-in de `<video>` full-screen (objectFit: cover) sobre o slideshow; ao remover, fade-out e slideshow retoma
- Lista de imagens hardcoded no componente (16 ficheiros de `public/images/`)
- `pointerEvents: none` — não interfere com interações do anel
- `RotatingWheel` expõe `onHoverChange(project | null)` → `HomePage` passa `hoveredProject` ao slideshow e ao `VideoPreview`

## Projetos Ativos (`src/data/projects.js`)

| Slug | Título | Thumbnail | Vídeo |
|------|--------|-----------|-------|
| `alpha` | Forma & Vazio | `/images/foto.png` | `WhatsApp Video 2026-01-27...mp4` |
| `beta` | Matéria Bruta | `/images/rere.png` | `WhatsApp Video 2026-01-27...mp4` |
| `granito-sonoro` | Granito Sonoro | `/images/1769655170128-299223567.png` | `/videos/full/1769656081661-870030845.mp4` |
| `ssonoro-2026` | SSonoro 2026 | `/images/1770268684737-515546375.png` | `WhatsApp Video 2026-01-27...mp4` (teste) |
| `epsilon` | Arquivo Vivo | `/images/1769656309539-230799152.png` | `WhatsApp Video 2026-01-27...mp4` (teste) |

> Todos os projetos partilham o mesmo vídeo de teste temporariamente.
> Títulos, descrições e tags são funcionais mas podem ser substituídos pelos reais.

## Estado Atual
- [x] Setup inicial do projeto (React + Vite)
- [x] Implementação do anel SVG rotativo (forma annular, sem texto nos segmentos)
- [x] Lógica de hover com abrandamento suave de rotação
- [x] Painel VideoPreview com info, tags e contador `01 / N`
- [x] Página de detalhe do projeto (`/projeto/:slug`) — design monochromático, vídeo full-width, Esc para voltar
- [x] Estética definida: fundo bege, monocromático, hover transparente, cursor crosshair
- [x] Tipografia Space Grotesk (Google Fonts)
- [x] Anel fino: `R_INNER = 245` (espessura ~55px)
- [x] Mobile: tap para preview, segundo tap para navegar
- [x] Acessibilidade: `aria-label`, `role="button"`, `tabIndex`, teclado (Enter/Space), `aria-current`
- [x] Anel dinâmico: cresce automaticamente com cada projeto adicionado ao array
- [x] Clip automático de 20s a partir de `videoFull` + `previewStart` (sem ficheiro separado)
- [x] Pastas `public/videos/full/`, `public/videos/preview/`, `public/images/` criadas
- [x] Slideshow de fundo com crossfade, pausa ao hover no anel
- [x] Vídeo de preview em full-screen no fundo ao hover (clip 20s, substitui slideshow com fade suave)
- [x] Caixa de info (título, descrição, tags) no canto inferior direito ao hover — efeito vidro (`backdrop-filter: blur`)
- [x] Thumbnail do projeto visível no segmento do anel (clipada ao arco); ao hover dissolve-se revelando vídeo
- [x] Hover: segmento torna-se **transparente** (fill + thumbnail dissolvem-se), não preto
- [x] Paths de assets corretos para `/images/` e `/videos/` (sem prefixo `/public/`)
- [x] Transição suave ao navegar: anel faz fade-out (300ms) antes de mudar de página
- [x] Fade-in ao entrar na ProjectPage; fade-out ao sair
- [x] Highlight do segmento ao voltar da página de detalhe (stroke espesso, 1.5s)
- [x] rAF pausa quando o tab não está visível (`visibilitychange`)
- [x] Animação de entrada do anel: `scale(0) → scale(1)` com spring cubic-bezier ao carregar
- [x] Painel VideoPreview com efeito vidro (`backdrop-filter: blur(14px)`, fundo semitransparente)
- [x] Thumbnails reais atribuídas a todos os 5 projetos
- [x] Granito Sonoro e SSonoro 2026 identificados e configurados com assets reais
- [x] MP4 movido de `/images/` para `/videos/full/` (Granito Sonoro)
- [x] Títulos/descrições/tags definidos para todos os projetos (Alpha→"Forma & Vazio", Beta→"Matéria Bruta", Epsilon→"Arquivo Vivo")
- [x] Todos os projetos com vídeo atribuído (SSonoro 2026 e Epsilon usam vídeo de teste)
- [x] Logo SVG "BT" no canto superior esquerdo (quadrado preto + texto bege)
- [x] Navbar fixa (topo): logo + "BAD TASTE" à esquerda; VIDEO / PHOTOS / CONTACTS à direita
- [x] CONTACTS na navbar navega para `/contactos` (página separada, fundo preto, Esc volta)
- [x] Footer de contactos na homepage (fundo `#111`): email, Instagram, telemóvel — visível ao fazer scroll
- [x] Footer tem `position: relative; z-index: 1` para aparecer acima do BackgroundSlideshow fixo
- [x] `history.scrollRestoration = 'manual'` em `main.jsx` — página começa sempre no topo ao refresh
- [x] Rota `/contactos` registada em `main.jsx`
- [x] Repositório GitHub criado e código publicado: https://github.com/TiadoDaCriador/Bad-Taste
- [x] Sistema i18n: Espanhol (padrão), Catalão e Inglês — seletor ES|CA|EN na navbar
- [x] Traduções completas: UI (navbar, footer, contactos, erros) + títulos/descrições/tags de todos os projetos
- [x] Língua guardada em `localStorage` (persiste entre sessões)
- [x] Página `/video` criada (`VideoPage.jsx`): grid 2 colunas dark (`#111`), todos os projetos; thumbnail visível por defeito (sem texto); hover → overlay escuro + título/tags/contador animados (fade+translateY); vídeo reproduz ao hover; clique → `/projeto/:slug`; último projeto ocupa largura total se ímpar; Esc volta à homepage
- [x] Navbar VIDEO atualizado de `#` para `/video`; rota `/video` registada em `main.jsx`
- [x] Página `/contactos` redesenhada: layout 2 colunas (info + formulário), separadas por linha vertical fina; formulário com inputs `border-bottom` only, labels caps, botão rectangular sem bordas arredondadas; estado "enviado" inverte cores por 3s; traduções do formulário adicionadas a todas as línguas (`t.contacts.form`)
- [x] Painel de admin criado (`/admin`, `/admin/dashboard`, `/admin/projects/:slug`)
- [x] Auth por password via `VITE_ADMIN_PASSWORD` no `.env` (sessionStorage)
- [x] Admin: criar, editar, apagar e reordenar projetos (todos os campos)
- [x] Admin: editar contactos (email, Instagram handle, Instagram URL, telemóvel)
- [x] Camada de dados `adminData.js`: páginas públicas lêem de localStorage (fallback para projects.js)
- [x] `.env` criado e ignorado pelo git; `.env.example` como template
- [x] Backend Express.js na porta 3001 (paralelo ao Vite 5173)
- [x] Multer: upload de fotos (`/images/`) e vídeos (`/videos/full/`)
- [x] API gallery CRUD: GET/POST/PUT/DELETE `/api/gallery` com persistência em JSON
- [x] Camada `galleryData.js`: getGallery, uploadPhoto, uploadVideo, addGalleryPhoto, updateGalleryPhoto, deleteGalleryPhoto, setCoverPhoto
- [x] Vite proxy: `/api` → `localhost:3001`
- [x] Scripts npm: `dev` (Vite+Express), `dev:frontend`, `server`
- [x] Página `/fotos` (PhotosPage.jsx): dark theme `#111`; card de capa 16/9 com hover overlay animado (nome + "VER GALERIA"); zoom subtil na imagem ao hover; clicar → `/fotos/galeria`
- [x] Página `/fotos/galeria` (GalleryPage.jsx): dark theme `#111`; grid 2 col quadrado edge-to-edge (1px gap preto); hover → overlay + caption + contador animados; lightbox minimalista (counter top-left, `✕` top-right, `‹ ›` laterais, caption bottom-center)
- [x] Foto de capa: campo `isCover` em `gallery.json`; botão `☆/★ CAPA` no admin; só uma capa de cada vez
- [x] Caption da foto capa = nome visível no card de entrada da página `/fotos`
- [x] AdminDashboard com secção GALERIA: upload de fotos, edição de caption/nome, botão ☆/★ CAPA, apagar com confirmação
- [x] AdminProjectEditor com upload direto: thumbnail, videoFull, videoPreview (com loading state)
- [x] Traduções para galeria (ES/CA/EN): `t.photos.title`, `t.photos.empty`
- [x] NavBar: link FOTOS atualizado de `#` para `/fotos`
- [x] Galeria reorganizada no admin: PROJETOS → GALERIA → SEGURANÇA → CONTACTOS
- [x] Botão "VER GALERIA" no admin dashboard para acesso rápido
- [x] Footer (`ContactsFooter.jsx`) partilhado: HomePage, VideoPage, PhotosPage, GalleryPage
- [x] Back button (← VOLVER) em VideoPage, PhotosPage, GalleryPage — com fade suave
- [x] VideoPage / PhotosPage / GalleryPage: redesign visual completo — fundo `#111`, navbar dark, cards sem texto por defeito; info surge **apenas ao hover** (overlay fade + translateY); BT logo invertido (beige sobre preto); estética editorial editorial dark inspirada em franciscotaboas.myportfolio.com
- [x] Admin: secção **SEGURANÇA** — alterar palavra-passe (verifica atual, mín. 6 chars, confirmação)
- [x] Palavra-passe customizada guardada em `localStorage(bt_admin_custom_password)`, sobrepõe-se ao `.env`
- [x] Responsividade completa em **todas as páginas**: `clamp()` para fluid typography/spacing
  - [x] HomePage: navbar, language switcher, footer responsivos
  - [x] VideoPage: navbar, grid 2 col → 1 col mobile, cards responsivos
  - [x] PhotosPage / GalleryPage: card capa responsivo, grid dinâmico, lightbox responsivo
  - [x] ProjectPage: back button, vídeo, conteúdo responsivos
  - [x] ContactsPage: header, layout 2 col → 1 col mobile, formulário responsivo
  - [x] AdminDashboard: tabela, inputs, buttons, espaçamento responsivos
- [ ] Formulário de contacto ligado a serviço de envio real (Formspree / Resend / etc.) — atualmente só UI
- [ ] `previewStart` afinado para cada vídeo (cortar no momento certo) — todos a `0` por agora
- [ ] Vídeos reais para SSonoro 2026 e Epsilon (substituir o vídeo de teste)
- [ ] Títulos/descrições/tags finais validados pelo cliente
- [ ] Deploy

> Ver [recomendações.md](recomendações.md) para detalhe completo.
