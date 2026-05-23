#!/usr/bin/env node
// Seeds 4 SEO-focused blog posts into the Supabase `posts` table.
// Reads service-role key from dashboard/.env. Run from repo root: `node scripts/seed-blogs.js`

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function loadDashboardEnv() {
  const env = {}
  const raw = readFileSync(resolve(root, 'dashboard/.env'), 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) env[m[1]] = m[2]
  }
  return env
}

const env = loadDashboardEnv()
const SUPABASE_URL = env.VITE_SUPABASE_URL
const SERVICE_KEY = env.VITE_SUPABASE_SERVICE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_KEY in dashboard/.env')
  process.exit(1)
}

const ACCENT = '#61c894'
const ACCENT_BORDER = 'rgba(97,200,148,.25)'
const ACCENT_BG = 'rgba(97,200,148,.06)'

const cta = (text) => `
<div style="margin:36px 0;padding:24px;border:1px solid ${ACCENT_BORDER};background:${ACCENT_BG};border-radius:14px">
  <p style="margin:0 0 10px;font-weight:600;color:${ACCENT}">${text}</p>
  <p style="margin:0"><a href="/" style="color:${ACCENT};text-decoration:underline">Try FitNyx free →</a></p>
</div>`

const faq = (items) => `
<h2>Frequently asked questions</h2>
${items.map((q) => `<h3>${q.q}</h3><p>${q.a}</p>`).join('\n')}`

const posts = [
  {
    slug: 'calorie-deficit-calculator-how-much-to-eat',
    title: 'Calorie Deficit Calculator: How Much Should You Actually Eat to Lose Fat?',
    excerpt: 'Most calorie calculators give you a number, not a plan. Here is the math that works, the mistakes to avoid, and how to set a deficit you can actually keep.',
    tags: ['Nutrition', 'Fat Loss', 'Calorie Deficit'],
    read_minutes: 7,
    date: '2026-05-20',
    content_html: `
<p>Almost every fat-loss problem comes back to one number: <strong>your daily calorie deficit</strong>. Set it too small and progress feels invisible. Set it too aggressive and you crash within three weeks. This guide gives you a calorie deficit calculator you can do on the back of a napkin, plus the rules for keeping the deficit working past month two.</p>

<h2>What a calorie deficit actually is</h2>
<p>A calorie deficit is the gap between the calories you eat and the calories your body burns. Burn 2,500 a day, eat 2,000, and the deficit is 500 kcal. Over a week that is ~3,500 kcal — roughly 0.45 kg of fat, give or take water and glycogen noise.</p>
<p>The trick is not the number — it is the <em>sustainability</em>. A 300 kcal deficit you hold for 16 weeks beats an 800 kcal deficit you blow up in 4.</p>

<h2>The 4-step calorie deficit calculator</h2>
<ol>
  <li><strong>Estimate your maintenance.</strong> Bodyweight (kg) × 30 = a starting maintenance for moderately active lifters. A 75 kg lifter is ~2,250 kcal.</li>
  <li><strong>Pick a deficit size.</strong> 15–20% of maintenance for steady fat loss. 75 kg → 340–450 kcal deficit. Target: 1,800–1,910 kcal a day.</li>
  <li><strong>Lock protein first.</strong> 1.8–2.2 g/kg bodyweight. That is the floor — non-negotiable on a cut. For 75 kg that is 135–165 g protein/day.</li>
  <li><strong>Split the rest.</strong> Fill remaining calories with ~60% carbs around training, ~40% fats elsewhere. Adjust based on how you feel and sleep.</li>
</ol>

${cta('Stop guessing — let FitNyx run the math from your weight, training load, and goal date.')}

<h2>Why most calorie deficit calculators fail you</h2>
<ul>
  <li><strong>They assume static maintenance.</strong> Your TDEE drops as you lose weight. Recheck every 3–4 weeks.</li>
  <li><strong>They ignore training fatigue.</strong> A 500 kcal deficit on a heavy-volume week crushes recovery. A context-aware planner trims volume <em>or</em> raises calories on those weeks.</li>
  <li><strong>They miss adherence reality.</strong> Weekends, travel, social meals. A "500 kcal/day" deficit averages out to 250 in real life.</li>
</ul>

<h3>The diet break rule</h3>
<p>Every 6–8 weeks of dieting, eat at maintenance for 5–7 days. It restores leptin, fixes sleep, and stops the metabolic adaptation spiral. The data on diet breaks (MATADOR trial, 2018) is unambiguous — they preserve more lean mass and produce more total fat loss across a 16-week block.</p>

<h2>Signs your deficit is too aggressive</h2>
<ul>
  <li>Resting heart rate up 5+ bpm over baseline for a week.</li>
  <li>Strength dropping on the same lifts week after week.</li>
  <li>Sleep latency over 30 min, or waking up at 4 a.m. wired.</li>
  <li>Mood and libido tanking.</li>
</ul>
<p>If two or more show up, bump calories up by 200 for 5 days and reassess. The scale will move <em>more</em>, not less.</p>

${faq([
  { q: 'How many calories should I eat to lose 1 pound a week?', a: 'A 500 kcal/day deficit averages 1 lb (0.45 kg) of fat loss per week. For most people that means eating 15–20% below maintenance.' },
  { q: 'Is a 1,200 calorie diet safe?', a: 'Rarely. 1,200 kcal is below the protein/fat floor for most adult lifters and produces muscle loss alongside fat loss. Eat the smallest deficit that still produces progress.' },
  { q: 'Can I lose fat without counting calories?', a: 'Yes — but you replace counting with strict food rules (protein at every meal, single-ingredient foods, no liquid calories). Calorie tracking is the lazier, more flexible option.' },
])}
`,
  },

  {
    slug: 'ai-workout-planner-vs-personal-trainer',
    title: 'AI Workout Planner vs Personal Trainer: 5 Things Only AI Does Better',
    excerpt: 'A good trainer is worth the money. An AI workout planner is not the same product — it wins on a different axis. Here is where each one beats the other.',
    tags: ['AI Coach', 'Workout Planner', 'Training Science'],
    read_minutes: 6,
    date: '2026-05-19',
    content_html: `
<p>Search for "AI workout planner" and you get 200 apps that all promise the same thing — a smarter program for less money. The pitch is mostly hype, but not entirely. There are five specific things an AI workout planner does better than a human trainer, and five things a trainer still owns. Here is the honest split.</p>

<h2>1. Daily replanning at zero marginal cost</h2>
<p>A trainer charges per session. An AI workout planner can rebuild your week every morning — after a missed leg day, a new injury note, a travel block — without you booking a call. That replanning frequency is where most "stuck" lifters actually get unstuck.</p>

<h2>2. Perfect memory of every set you ever did</h2>
<p>Your trainer remembers last Tuesday. Maybe. A context-aware AI coach can pull every set, every RPE, every skipped session from the last 12 months and adjust this week's volume against it. That is the entire foundation of progressive overload — and the thing humans, even good ones, lose track of.</p>

${cta('FitNyx replans your week based on what actually happened — not what was scheduled.')}

<h2>3. Availability at 5:47 a.m. when you decide to lift</h2>
<p>You wake up, your shoulder is grumpy, you have 45 minutes. A trainer is asleep. A good AI workout planner swaps your push day to a horizontal-pull-focused session in 8 seconds. Speed of response > raw expertise here.</p>

<h2>4. Pattern recognition across thousands of users</h2>
<p>A human trainer's intuition is built on the ~200 clients they have trained. A well-built AI sees patterns across hundreds of thousands of training logs. That does not make it smarter — it makes it more <em>statistically calibrated</em>. Useful for things like "people who plateau at this strength level usually fix it by deloading, not by adding sets."</p>

<h2>5. Consistency of cueing and form prompts</h2>
<p>Even great trainers have off days. An AI coach delivers the same cue with the same emphasis, every set. For learners drilling a movement (RDL hip hinge, front-rack position, brace pattern) that repeatability is gold.</p>

<h2>Where a personal trainer still wins</h2>
<ul>
  <li><strong>Live form correction.</strong> No camera-based system catches a soft brace under load like a coach with eyes on the bar.</li>
  <li><strong>Accountability that actually scares you.</strong> The standing 6 a.m. appointment beats a push notification.</li>
  <li><strong>Edge-case injury triage.</strong> "Is this knee pain sketchy?" needs a human in the room.</li>
  <li><strong>Mental coaching during a real PR attempt.</strong> Not yet.</li>
  <li><strong>Onboarding total beginners.</strong> First six weeks of lifting, find a human.</li>
</ul>

<h3>The hybrid that actually wins</h3>
<p>Best result for most lifters: an AI workout planner running the day-to-day program, a human coach for monthly check-ins and movement audits. Cost: ~$15/month + one $80 session every 4–6 weeks. That is a 90% solution at 20% of the cost of weekly 1:1 training.</p>

${faq([
  { q: 'Is an AI workout planner as good as a personal trainer?', a: 'Not for absolute beginners or for live form work — but for established lifters who need consistent programming and daily replanning, an AI planner outperforms most $80/session trainers on the metrics that actually drive progress.' },
  { q: 'How does an AI workout planner know my level?', a: 'It calibrates from your first 2–3 sessions — weights logged, RPE/RIR you report, completion rate. A good planner like FitNyx then keeps recalibrating every week based on real performance, not your initial questionnaire.' },
  { q: 'Can AI prevent injury?', a: 'It can reduce risk by managing volume spikes, flagging asymmetries, and routing around tagged tweaks. It cannot replace a physio for an existing injury.' },
])}
`,
  },

  {
    slug: 'hypertrophy-101-how-muscle-grows',
    title: 'Hypertrophy 101: How Muscle Actually Grows (And Why Most Programs Miss It)',
    excerpt: 'Hypertrophy is not about lifting heavy or going to failure. It is about three specific stimuli, applied across enough weekly volume — and most programs only get one of them right.',
    tags: ['Muscle Gain', 'Hypertrophy', 'Training Science'],
    read_minutes: 8,
    date: '2026-05-18',
    content_html: `
<p>Walk into any gym and ask five lifters how muscle grows. You will get five different answers — "heavy weight," "to failure," "the pump," "more protein." All partially right, all incomplete. Here is what the last 15 years of hypertrophy research actually settled on, and how to translate it into a program that works.</p>

<h2>The three drivers of hypertrophy</h2>
<ol>
  <li><strong>Mechanical tension.</strong> The dominant driver. Heavy enough load (≥60% 1RM) applied through a full range of motion. This is what makes a muscle fiber actually grow.</li>
  <li><strong>Metabolic stress.</strong> The "burn." Time under tension with limited rest. Produces a smaller but real growth signal, especially in slow-twitch fibers.</li>
  <li><strong>Muscle damage.</strong> Microtears that trigger repair. Useful in small doses; overdone, it just blocks the next session.</li>
</ol>
<p>If your program nails tension but ignores the other two, you grow slowly. If it chases the pump and skips heavy work, you spin your wheels. The bigger lifters in the room are getting all three across the week.</p>

<h2>Volume is the lever most people pull wrong</h2>
<p>Weekly sets per muscle group is the single most predictive variable in the hypertrophy literature (Schoenfeld et al., dose-response meta-analyses, 2017–2022). The bands:</p>
<ul>
  <li><strong>10 sets/week:</strong> minimum effective dose. Maintenance for intermediates.</li>
  <li><strong>12–20 sets/week:</strong> the growth zone for most lifters.</li>
  <li><strong>20+ sets/week:</strong> diminishing returns and rising injury risk unless you have years of base.</li>
</ul>

${cta('FitNyx tracks weekly sets per muscle group automatically — so you know when to push and when to deload.')}

<h2>Rep ranges: less narrow than you think</h2>
<p>The old "8–12 reps for hypertrophy" rule is mostly folklore. Hypertrophy happens across the 5–30 rep range as long as sets are taken close to failure (within 0–3 reps in reserve). What changes is the joint-and-fatigue cost.</p>
<ul>
  <li><strong>5–8 reps:</strong> heavy compounds. High CNS cost, low set count per session.</li>
  <li><strong>8–15 reps:</strong> the sweet spot for most accessory work.</li>
  <li><strong>15–30 reps:</strong> excellent for small muscles (rear delts, calves, biceps) and joint-friendly work.</li>
</ul>

<h3>Proximity to failure matters more than the rep number</h3>
<p>A set of 10 with 5 reps left in the tank does almost nothing. A set of 10 with 1–2 reps left does almost everything. Train hard enough that the last rep is grindy — across all rep ranges.</p>

<h2>The recovery cap nobody talks about</h2>
<p>You can program 25 sets/week for chest. Your nervous system, joints, and sleep cannot necessarily support it. Signs you have overshot the recovery cap:</p>
<ul>
  <li>Strength on the prime lift for that muscle stalls or drops for two weeks.</li>
  <li>Bar speed slow on warm-up sets.</li>
  <li>Persistent low-grade soreness that does not clear by session start.</li>
</ul>
<p>The fix is almost always a 40–50% volume cut for one week, then resuming at 80% of the previous load.</p>

${faq([
  { q: 'How many sets per week for muscle growth?', a: 'Most lifters grow best at 12–20 hard sets per muscle group per week, split across 2–3 sessions. Below 10 is maintenance; above 20 hits diminishing returns.' },
  { q: 'Do I need to lift to failure to build muscle?', a: 'No — but you need to be close. Within 0–3 reps of failure on most sets is enough. Going to true failure on every set produces fatigue without much extra growth.' },
  { q: 'How long until I see muscle growth?', a: 'Visible change in 8–12 weeks of consistent training and a small calorie surplus. Beginner gains are faster (4–6 weeks). Strength shows up first, size follows.' },
])}
`,
  },

  {
    slug: 'how-to-start-working-out-at-home',
    title: 'How to Start Working Out at Home: A No-Equipment 8-Week Plan That Works',
    excerpt: 'You do not need a gym, a Bowflex, or even dumbbells. Eight weeks of bodyweight progressions, three sessions a week, and a real plan. Here it is.',
    tags: ['Beginners', 'Home Workout', 'Bodyweight'],
    read_minutes: 7,
    date: '2026-05-17',
    content_html: `
<p>The hardest part of starting to work out at home is not the workout — it is having a plan that progresses. Doing 20 push-ups every day forever does almost nothing. Doing push-ups that get progressively harder for 8 weeks changes your body. Here is the plan.</p>

<h2>The 4 movement patterns you need</h2>
<p>Every functional, balanced bodyweight program covers these four patterns. If your home workout misses one, you are leaving results on the floor.</p>
<ol>
  <li><strong>Push:</strong> push-ups (incline → standard → decline → archer).</li>
  <li><strong>Pull:</strong> doorframe rows, towel rows, eventually pull-ups if you have a bar.</li>
  <li><strong>Squat:</strong> bodyweight squat → split squat → Bulgarian split squat → pistol progression.</li>
  <li><strong>Hinge:</strong> single-leg Romanian deadlift, glute bridge → hip thrust → single-leg hip thrust.</li>
</ol>

<h2>The 8-week plan: 3 sessions/week, ~30 min each</h2>
<p>Session A (push + squat focus), Session B (pull + hinge focus), Session C (full-body). Alternate A → B → C across the week. Same template for all 8 weeks — the <em>progressions</em> are what change.</p>

<h3>Sample Session A</h3>
<ul>
  <li>Push-up progression — 4 sets of 6–10 reps</li>
  <li>Split squat — 3 sets of 8/leg</li>
  <li>Pike push-up (shoulder bias) — 3 sets of 6–8</li>
  <li>Glute bridge — 3 sets of 12</li>
  <li>Plank — 3 sets of 30–45 sec</li>
</ul>

${cta('FitNyx generates a custom home workout plan from your equipment, schedule, and experience — and progresses it weekly.')}

<h2>The 4-step progression rule</h2>
<p>Cannot add weight at home? Use these four levers in order. When you hit the top of one, move to the next.</p>
<ol>
  <li><strong>Add reps.</strong> Same exercise, +1–2 reps/set per week until top of range.</li>
  <li><strong>Add sets.</strong> 3 sets → 4 sets when reps stop progressing.</li>
  <li><strong>Slow the tempo.</strong> 3-second descent, 1-second pause, explode up.</li>
  <li><strong>Harden the variation.</strong> Standard push-up → archer push-up → one-arm progression.</li>
</ol>

<h2>The two mistakes that kill home programs</h2>
<ul>
  <li><strong>No log.</strong> Without a record of what you did last session, you cannot progress. Even a notes app works.</li>
  <li><strong>No deload.</strong> Week 4 and week 8: cut volume by 40%. Your joints will thank you and week 5 will feel powerful.</li>
</ul>

<h3>Equipment worth buying (in order)</h3>
<ol>
  <li>Doorframe pull-up bar (~$30) — unlocks 5 new exercises.</li>
  <li>Resistance bands (~$25) — load on push, pull, and hinge patterns.</li>
  <li>Adjustable dumbbells (~$150) — only when you have outgrown bands.</li>
</ol>

${faq([
  { q: 'Can I build muscle working out at home without weights?', a: 'Yes, especially for the first 12–18 months. Bodyweight progressions for push, pull, squat, hinge — taken close to failure — drive real hypertrophy. Past intermediate, you will want load.' },
  { q: 'How often should I work out at home as a beginner?', a: 'Three sessions a week, 30–40 min each, is the sweet spot for the first 8 weeks. More frequency without more recovery is a regression.' },
  { q: 'Will I see results in 8 weeks?', a: 'Yes — strength jumps in week 2–3, visible muscle and conditioning changes in week 6–8 if nutrition is dialed in. Track measurements and progress photos, not just the scale.' },
])}
`,
  },
]

async function insertPost(p) {
  const payload = {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: {},
    content_html: p.content_html.trim(),
    date: p.date,
    tags: p.tags,
    cover_url: null,
    author_name: 'Tarosh M.',
    author_role: 'Founder, FitNyx',
    read_minutes: p.read_minutes,
    published: true,
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation,resolution=merge-duplicates',
    },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${text}`)
  const row = JSON.parse(text)[0]
  console.log(`[seed] inserted ${row.slug}`)
}

async function main() {
  for (const p of posts) await insertPost(p)
  console.log(`[seed] done — ${posts.length} posts`)
}

main().catch((e) => {
  console.error('[seed] failed:', e.message)
  process.exit(1)
})
