// Para adicionar um projeto: basta acrescentar um objeto a este array.
// O anel divide-se automaticamente em segmentos iguais conforme o número de projetos.
//
// Campos de vídeo:
//   videoFull     — path para o vídeo completo (em public/videos/full/)
//   previewStart  — segundo a partir do qual começa o clip de 20s no painel de preview
//                   (0 = início do vídeo; ex: 45 = começa aos 0:45)
//   videoPreview  — (opcional) ficheiro de preview separado; se definido, sobrepõe-se
//                   ao clip automático do videoFull
//
// Thumbnail:
//   thumbnail     — (opcional) path para imagem estática do projeto (em public/images/)
//                   aparece no segmento do anel; ao hover o segmento inverte para preto

export const projects = [
  {
    title: 'Forma & Vazio',
    slug: 'alpha',
    color: '#e63946',
    videoFull: '/videos/full/WhatsApp%20Video%202026-01-27%20at%2015.46.03.mp4',
    previewStart: 0,
    videoPreview: null,
    thumbnail: '/images/foto.png',
    description: 'Exploração da relação entre forma e espaço negativo em suporte editorial e digital.',
    tags: ['Editorial', 'Motion', 'Design'],
  },
  {
    title: 'Matéria Bruta',
    slug: 'beta',
    color: '#457b9d',
    videoFull: '/videos/full/WhatsApp%20Video%202026-01-27%20at%2015.46.03.mp4',
    previewStart: 0,
    videoPreview: null,
    thumbnail: '/images/rere.png',
    description: 'Sistema de identidade para estúdio de arquitetura com foco em materiais e textura.',
    tags: ['Identidade', 'Branding', 'Tipografia'],
  },
  {
    title: 'Granito Sonoro',
    slug: 'granito-sonoro',
    color: '#2a9d8f',
    videoFull: '/videos/full/1769656081661-870030845.mp4',
    previewStart: 0,
    videoPreview: null,
    thumbnail: '/images/1769655170128-299223567.png',
    description: 'Identidade visual e comunicação para a 1ª edição do festival Granito Sonoro, Penacova-Coimbra.',
    tags: ['Identidade', 'Festival', 'Print'],
  },
  {
    title: 'SSonoro 2026',
    slug: 'ssonoro-2026',
    color: '#e9c46a',
    videoFull: '/videos/full/WhatsApp%20Video%202026-01-27%20at%2015.46.03.mp4',
    previewStart: 0,
    videoPreview: null,
    thumbnail: '/images/1770268684737-515546375.png',
    description: 'Identidade visual para a 2ª edição do SSonoro 2026, Viana do Castelo.',
    tags: ['Identidade', 'Tipografia', 'Festival'],
  },
  {
    title: 'Arquivo Vivo',
    slug: 'epsilon',
    color: '#f4a261',
    videoFull: '/videos/full/WhatsApp%20Video%202026-01-27%20at%2015.46.03.mp4',
    previewStart: 0,
    videoPreview: null,
    thumbnail: '/images/1769656309539-230799152.png',
    description: 'Plataforma digital de arquivo e curadoria para companhia de artes performativas.',
    tags: ['Web', 'UX', 'Artes Performativas'],
  },
]
