/**
 * Single source of truth for identity, contacts and integrations.
 * Edit here — every section, the modal and the form read from this file.
 */

export const site = {
  url: 'https://www.ikunstler.com',
  name: 'Elijah Künstler',
  brand: 'iKu.group',
  title: 'Elijah Künstler — AI Pipeline Architect & Executive Producer',
  description:
    'I design generative node-based pipelines, advise C-level executives on secure AI integration, and deliver turnkey commercial video through custom-assembled senior teams.',
  role: 'AI Pipeline Architect | Executive Producer | Strategic Advisor',
  locale: 'en_US',
  availability: 'Available for Advisory & Turnkey Production',
  ogImage: '/og-image.png',
};

export const contacts = {
  phoneDisplay: '+380 99 222 55 13',
  phoneHref: 'tel:+380992225513',
  whatsapp: 'https://wa.me/380992225513',
  // TODO: replace with the working account once it is registered.
  telegram: 'https://t.me/ikunstler',
  telegramHandle: '@ikunstler',
  email: 'ikunstler.group@gmail.com',
  linkedin: 'https://www.linkedin.com/in/elijah-k%C3%BCnstler-58305a226/',
  instagram: 'https://www.instagram.com/iku.group/',
  instagramHandle: '@iku.group',
};

/**
 * Optional hero footage. Drop files into /public/media and set the paths.
 * While `src` is empty, the Director View renders a generative camera-monitor scene.
 */
export const heroMedia = {
  director: { src: '', poster: '' },
};

export const form = {
  endpoint: import.meta.env.PUBLIC_FORM_ENDPOINT ?? '',
  accessKey: import.meta.env.PUBLIC_FORM_ACCESS_KEY ?? '',
};

export const nav = [
  { label: 'Track Record', href: '#track-record' },
  { label: 'Approach', href: '#approach' },
  { label: 'Services', href: '#services' },
  { label: 'R&D Lab', href: '#rnd-lab' },
  { label: 'Tech Stack', href: '#tech-stack' },
];
