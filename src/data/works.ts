import type { WorkItem } from '../types'

// Optimised display WebP (1400px, used in overlay + lightbox)
const d = (name: string) => {
  const webp = name.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/, '.webp')
  return `/display/${webp}`
}

// Tiny WebP thumbnail (320px, used in grids)
const t = (name: string) => {
  const webp = name.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/, '.webp')
  return `/thumbs/${webp}`
}

export const works: WorkItem[] = [
  {
    id: 'goro',
    src:   d('goro_bright.jpg'),
    thumb: t('goro_bright.jpg'),
    alt:   'Goro Majima',
    category: 'illustration',
    variants: [
      d('goro_rush_bright.jpg'),
      d('goro_slug_bright.jpg'),
      d('goro_thug_bright.jpg'),
    ],
  },
  {
    id: 'kiryu',
    src:   d('kiryu_dragon_bright.jpg'),
    thumb: t('kiryu_dragon_bright.jpg'),
    alt:   'Kiryu Kazuma',
    category: 'illustration',
    variants: [
      d('kiryu_beast_bright.jpg'),
      d('kiryu_brawler_bright.jpg'),
      d('kiryu_rush_bright.jpg'),
    ],
  },
  {
    id: 'tbhx',
    src:   d('tbhx.jpg'),
    thumb: t('tbhx.jpg'),
    alt:   'TBHX',
    category: 'illustration',
    variants: [
      d('tbhx_black.jpg'),
      d('tbhx_blue.jpg'),
    ],
  },
  {
    id: 'akiyama',
    src:   d('Akiyama.jpg'),
    thumb: t('Akiyama.jpg'),
    alt:   'Akiyama',
    category: 'illustration',
  },
  {
    id: 'berk',
    src:   d('berk.jpg'),
    thumb: t('berk.jpg'),
    alt:   'Berk',
    category: 'illustration',
  },
  {
    id: 'lamp1',
    src:   d('cad/Lamp1.jpg'),
    thumb: t('cad/Lamp1.jpg'),
    alt:   'Lamp 1',
    category: 'cad',
    drawings: [
      d('cad/Lamp1_Drawing1.JPG'),
      d('cad/Lamp1_Drawing2.JPG'),
    ],
  },
  {
    id: 'lamp2',
    src:   d('cad/Lamp2.png'),
    thumb: t('cad/Lamp2.png'),
    alt:   'Lamp 2',
    category: 'cad',
    drawings: [
      d('cad/Lamp2_Drawing1.PNG'),
      d('cad/Lamp2_Drawing2.PNG'),
    ],
  },
]

export const illustrations = works.filter(w => w.category === 'illustration')
export const cadWorks      = works.filter(w => w.category === 'cad')
