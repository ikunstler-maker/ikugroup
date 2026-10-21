# www.ikunstler.com

Односторінковий лендінг Elijah Künstler · iKu.group: AI Pipeline Architect & Executive Producer.

**Стек:** [Astro 7](https://astro.build) (статична генерація, ~7 KB JS на клієнті) + Tailwind CSS 4.
Шрифти лежать на тому ж сервері, що й сайт (Inter з optical sizes і JetBrains Mono), тому сайт не робить жодного запиту до Google Fonts. На пристроях Apple заголовки показуються системним SF Pro.

## Швидкий старт

```bash
npm install
```

```bash
npm run dev
```

Відкрийте http://localhost:4321.

| Команда | Що робить |
| --- | --- |
| `npm run dev` | Dev-сервер з hot reload |
| `npm run build` | Продакшн-збірка в `dist/` |
| `npm run preview` | Локальний перегляд зібраного `dist/` |
| `npm run check` | Перевірка типів TypeScript / Astro |
| `npm run og` | Перегенерувати `og-image.png` і `apple-touch-icon.png` |

## Де що редагувати

| Що | Файл |
| --- | --- |
| Контакти, Telegram, WhatsApp, e-mail, соцмережі, навігація | `src/config/site.ts` |
| Увесь текст сайту (секції, клієнти, послуги, продукти, стек, мови) | `src/data/content.ts` |
| Кольори, шрифти, типографіка | `src/styles/global.css` (блок `@theme`) |
| Секції сторінки | `src/components/*.astro` |
| Нодовий граф в Architect View | `src/components/hero/NodeGraph.astro` |
| Інтерактивність (меню, вкладки, перемикач, форма, модалка) | `src/scripts/*.ts` |

### Що потрібно зробити перед запуском

1. **Telegram.** Коли зареєструєте робочий акаунт, замініть `telegram` і `telegramHandle` у `src/config/site.ts` (там стоїть `TODO`).
2. **Доставка форми** (рекомендовано). Без налаштувань форма вже працює: збирає заявку й пропонує надіслати її в один дотик через WhatsApp, Telegram або e-mail з готовим текстом. Щоб заявки приходили на пошту автоматично:
   - зареєструйтеся на [Web3Forms](https://web3forms.com) (безкоштовно) і отримайте access key;
   - скопіюйте `.env.example` у `.env` і заповніть його:
     ```
     PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
     PUBLIC_FORM_ACCESS_KEY=ваш-ключ
     ```
   - на хостингу задайте ці самі змінні в налаштуваннях Environment Variables.
   Formspree теж підходить: вкажіть його URL у `PUBLIC_FORM_ENDPOINT`, ключ не потрібен. Якщо сервіс поверне помилку, форма сама покаже кнопки WhatsApp, Telegram і e-mail, тож заявка не загубиться.
3. **Відео в Hero** (необов'язково). Покладіть ролик у `public/media/`, наприклад `director-reel.mp4` (H.264, без звуку, 6–12 с, до 4 МБ), і пропишіть шлях у `heroMedia.director.src` у `src/config/site.ts`. Доки шлях порожній, у Director View показується згенерована кінематографічна сцена.
4. **Логотипи клієнтів** (необов'язково). Зараз у стрічці назви клієнтів набрані шрифтом. Якщо маєте SVG-логотипи з дозволом на використання, їх можна додати в `src/components/TrackRecord.astro`.

## Деплой на Vercel

Проєкт уже готовий до Vercel. Усі налаштування лежать у `vercel.json`:
- фреймворк Astro, `npm ci` → `npm run build` → `dist/`;
- Node.js 24 (поле `engines` у `package.json`);
- редирект `ikunstler.com` → `https://www.ikunstler.com`;
- security-заголовки (`nosniff`, заборона вбудовування в iframe, `Referrer-Policy`, `Permissions-Policy`);
- довготривалий кеш для файлів з `/_astro/` (у їхніх назвах є хеш, тож кеш безпечний).

### 1. Запуште репозиторій на GitHub

Створіть **порожній приватний** репозиторій на github.com (без README і .gitignore), наприклад `ikunstler-com`. Потім у цій папці:

```bash
git remote add origin https://github.com/<ваш-логін>/ikunstler-com.git
```

```bash
git push -u origin main
```

### 2. Імпортуйте проєкт у Vercel

1. Зайдіть на [vercel.com/new](https://vercel.com/new) через GitHub.
2. *Import Git Repository* → оберіть `ikunstler-com`. Налаштування підтягнуться з `vercel.json`, нічого міняти не треба.
3. *Environment Variables* (необов'язково, але рекомендовано) — для автодоставки форми:
   - `PUBLIC_FORM_ENDPOINT` = `https://api.web3forms.com/submit`
   - `PUBLIC_FORM_ACCESS_KEY` = ваш ключ Web3Forms
4. **Deploy.** За хвилину з'явиться адреса `ikunstler-com.vercel.app`.

Далі кожен `git push` у `main` автоматично оновлює сайт, а кожна інша гілка отримує власний preview-URL.

> Змінні `PUBLIC_*` вбудовуються в сайт під час збірки. Якщо додали або змінили їх після деплою, натисніть у Vercel *Deployments → … → Redeploy*.

### 3. Підключіть домен www.ikunstler.com

1. У Vercel: *Project → Settings → Domains* → додайте `www.ikunstler.com`, потім `ikunstler.com`. Для кореневого домену оберіть *Redirect to www.ikunstler.com*.
2. У DNS-панелі реєстратора домену пропишіть записи, які покаже Vercel. Зазвичай це:

   | Тип | Ім'я | Значення |
   | --- | --- | --- |
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

   Точні значення завжди беріть з екрана Vercel: для нових проєктів вони можуть відрізнятися.
3. SSL-сертифікат Vercel видасть автоматично після того, як оновиться DNS (від кількох хвилин до кількох годин).

## SEO

- Мета-теги, Open Graph і Twitter Card, canonical URL
- JSON-LD (`Person` + `ProfessionalService`) з посиланням на верифікацію сертифіката Google AI
- `sitemap-index.xml` генерується автоматично, `robots.txt` лежить у `public/`
- OG-зображення 1200×630: `public/og-image.png`

## Доступність і продуктивність

- Повна навігація з клавіатури: skip link, стрілки у вкладках, Esc закриває модалку й меню, focus повертається на кнопку, з якої відкрили модалку
- Підтримка `prefers-reduced-motion`: анімації, авто-перемикання viewport і зерно плівки вимикаються
- Без JavaScript увесь контент лишається видимим і читабельним
- Mobile-first, без горизонтального скролу на 375px; модалка на телефоні відкривається як bottom sheet
