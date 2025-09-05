# HackProto (StudyBuddy Matching Prototype)

StudyBuddy HackProto is a working prototype that:
- Registers students (user profiles) into Supabase (table: `users`).
- Uses Google Gemini (model: gemini-2.5-flash) to generate top 3 study buddy matches.
- Returns strictly structured JSON: name, score, reason.
- (Planned) Fallback heuristic if AI call fails (current version emphasizes the AI path).

This is an iteration prototype to validate matching quality and data shape before building a production backend and UI.

---

## Table of Contents
- [Overview](#overview)
- [Implemented Features](#implemented-features)
- [Student Model (Current Data Shape)](#student-model-current-data-shape)
- [Matching Flow](#matching-flow)
- [Gemini Prompt Strategy](#gemini-prompt-strategy)
- [Setup & Running](#setup--running)
- [Example Usage](#example-usage)
- [Roadmap (Next Steps)](#roadmap-next-steps)

---

## Overview
Core loop:
1. Create a `Student` instance from profile data.
2. Insert profile into Supabase (`users` table).
3. Gather other users as candidates.
4. Call `Student.getMatch(candidates)` → Gemini produces a ranked JSON list of up to 3 high‑compatibility study partners.

Intentionally minimal: no formal HTTP layer, no environment variable documentation here, no endpoint design section (kept lean per request).

---

## Implemented Features
- `Student` class describing the active user seeking a match.
- Supabase insertion helper (`signUp`) for new profiles.
- Gemini prompt assembly with explicit matching criteria (subjects, availability, preferred language, school, special notes).
- Strict JSON enforcement via system instruction (rejects extra prose).
- Distinct reasoning text per match candidate.

---

## Student Model (Current Data Shape)

(Directly mirrors the constructor in `src/services/BackStuff.js`.)

| Field          | Description |
|----------------|-------------|
| id             | UUID / unique identifier (external or Supabase generated) |
| full_name      | Student’s display name |
| subjects       | Array of subject strings |
| availability   | Freeform textual block (prototype) |
| preferred_lang | Language for collaboration (e.g. "English") |
| school         | Institution / school identifier |
| special        | Special requirements / notes (accommodations, preferences) |
| created_by     | Placeholder for future authenticated user id |

Supabase `users` table (aligned suggestion):

users
| column        | type        | notes |
|---------------|-------------|-------|
| id            | uuid pk     | default gen_random_uuid() |
| created_at    | timestamptz | now() |
| full_name     | text        | not null |
| subjects      | text[]      | |
| availability  | text        | (may evolve to JSON) |
| preferred_lang| text        | |
| school        | text        | |
| special       | text        | nullable |
| created_by    | text        | placeholder |

Future improvements:
- Normalize `subjects` (canonical tags)
- Convert `availability` into structured JSON: `[ { day, start, end } ]`
- Add indexing on subjects (`GIN` on text[])

---

## Matching Flow
1. Instantiate current student.
2. Retrieve candidate list (exclude the current student externally).
3. Serialize candidate list + criteria into a single prompt string.
4. Gemini returns JSON with:
   ```
   {
     "matches": [
       { "name":"...", "score":85, "reason":"..." },
       ...
     ]
   }
   ```
5. Parse & use directly. (No persistence of match history yet.)

Planned additions:
- Self-filtering inside `getMatch`
- Rejection of malformed JSON with retry
- Offline heuristic fallback (subject/time/keyword overlap scoring)

---

## Gemini Prompt Strategy
Instruction summary embedded (systemInstruction):
- Role: compatibility algorithm.
- Input: list of students + active student’s criteria.
- Output: exactly JSON with top 3 matches.
- Each match includes:
  - name
  - score (0–100)
  - reason (2–3 sentences, emphasizing different aspects across matches)
- Strict: no commentary outside JSON.

Variability requirement:
- Forces diversification (e.g., one highlights subjects, another availability, another school or special requirement).

Failure handling (current):
- If JSON parse fails → throws.
- Fallback heuristic module not yet implemented (placeholder for future extension).

---

## Setup & Running

Clone & install:
```bash
git clone https://github.com/Josh5620/HackProto.git
cd HackProto
npm install
```

(Provide your own local configuration for Supabase + Gemini inside the code or a lightweight config loader—this README intentionally omits environment variable documentation.)

Run (example if an entry file exists):
```bash
node src/services/BackStuff.js
```

Or integrate the `Student` class into a small script that:
- Fetches users from Supabase
- Builds candidates
- Calls `getMatch`

---

## Example Usage
```js
import { Student } from './src/services/BackStuff.js';

// Current (seeking) student
const seeker = new Student(
  'UUID-1',
  'Alice',
  ['Math','Physics'],
  'Mon 18-20; Wed 18-20',
  'English',
  'State University',
  'Needs quiet environment',
  'creator-id'
);

// Candidate list (fetched from Supabase previously)
const candidates = [
  new Student('UUID-2','Ben',['Math','Chemistry'],'Mon 17-19','English','State University','', 'x'),
  new Student('UUID-3','Dana',['Physics','Biology'],'Wed 18-21','English','State University','', 'x'),
  new Student('UUID-4','Chen',['History','Math'],'Tue 10-12','Mandarin','State University','Prefers mornings','x')
];

const matches = await seeker.getMatch(candidates);
console.log(matches);
```

Sample output:
```json
[
  {
    "name": "Ben",
    "score": 84,
    "reason": "Strong overlap in Math plus partial Monday availability window; same school and shared language should enable efficient collaboration."
  },
  {
    "name": "Dana",
    "score": 71,
    "reason": "Physics overlap and a full shared Wednesday evening slot create good scheduling alignment despite fewer shared subjects."
  },
  {
    "name": "Chen",
    "score": 58,
    "reason": "Some Math overlap and shared institution; availability is less aligned but still workable for asynchronous review sessions."
  }
]
```

---

## Roadmap (Next Steps)
Immediate:
- Auto-exclude current student from candidate array
- Add try/catch JSON schema validation (reject partial responses)
- Introduce fallback heuristic scoring

Short Term:
- Structured availability (object array)
- Subject normalization (lowercase canonical forms)
- Semantic similarity of “special” notes (embedding or keyword matching)

Mid Term:
- Match history logging
- Feedback loop: user approves/discards suggested matches
- Group (multi-partner) generation

Long Term:
- Auth + role-based access
- Rate limiting & caching of repeated match calls
- Vector search (pgvector) for goals/notes
- Edge deployment for low-latency matching
