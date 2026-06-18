# XviFloo Ecosystem

Official technology ecosystem platform for:

- **XviTypoo** (Typing Platform)
- **XviGet** (Widget Engine)
- **Kleava AI** (AI Assistant)

## Tech stack

- Next.js 15 + App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL
- Auth.js (NextAuth)
- React Query
- Cloudinary (planned for CMS media)

## Getting started

1. Create your environment file:

```bash
copy .env.example .env
```

2. Set `DATABASE_URL` to a PostgreSQL instance.

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npm run db:generate
```

5. Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Database

- Prisma schema: `prisma/schema.prisma`
- Useful commands:
  - `npm run db:migrate`
  - `npm run db:push`
  - `npm run db:studio`

## Auth

- Auth route: `src/app/api/auth/[...nextauth]/route.ts`
- Sign-in page: `src/app/auth/sign-in/page.tsx`
- Configure providers via `.env` (GitHub/Google are optional).

## i18n (English + Bangla)

- Cookie-based locale selection (`xv_locale`)
- Dictionaries:
  - `src/i18n/dictionaries/en.ts`
  - `src/i18n/dictionaries/bn.ts`

## Theme (Light / Dark / System)

- Implemented with `next-themes` (`class` strategy)
- CSS variables in `src/app/globals.css` (shadcn compatible)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
