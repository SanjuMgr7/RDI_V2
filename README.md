# RDI Platform

An applicant tracking system I built for the RDI recruitment team, with some AI help for writing emails.

The idea was to get away from tracking candidates in spreadsheets. Everything about a candidate (skills, qualifications, current status) sits on one screen, so a recruiter or a teacher looking for the right student doesn't need to jump between files.

## What it does

- **Pipeline board.** A Kanban-style board that moves candidates from *Applied* to *Hired*. When you change a status it is saved to the database straight away.
- **Talent pool.** A dense list of all candidates, designed to fit as much information on screen as possible.
- **AI email drafts.** Pulls the candidate's skills from the database and asks GPT-4o-mini to write a personalized interview invite.
- **You stay in control.** The AI answer comes back as structured JSON and is shown in an editable form. Nothing is sent until the recruiter has checked it.

## Built with

- Frontend: React, Tailwind CSS, Axios, Lucide React
- Backend: Node.js, Express, Prisma ORM, OpenAI SDK
- Database: PostgreSQL, hosted on Neon

## Getting started

### Prerequisites

- Node.js v16 or newer
- Git
- A PostgreSQL database (a free Neon project works fine)
- An OpenAI API key

### Installation

Clone the repository:

```bash
git clone https://github.com/SanjuMgr7/RDI_V2.git
cd RDI_V2
```

Install the dependencies for the backend and the frontend:

```bash
cd server
npm install
cd ../client
npm install
```

Create a file called `.env` inside `server/` and add your own values:

```env
DATABASE_URL="postgresql://user:password@host/dbname"
OPENAI_API_KEY="your-openai-key"
```

Then create the database tables:

```bash
cd ../server
npx prisma migrate dev
```

Keep `.env` out of Git. It contains secrets.

## Usage

Run the backend and the frontend in separate terminals:

```bash
# backend
cd server
npm run dev

# frontend
cd client
npm start
```

Open http://localhost:3000. From there you can drag candidates between columns on the pipeline board, browse the talent pool, or open a candidate and click the email button to get a draft.

## Maintainer

This project is maintained by [SanjuMgr7](https://github.com/SanjuMgr7). If you find a bug, please open an issue in the repository.
