// Blog post data — edit / add / remove freely.
// Each post: { slug, title, excerpt, date (ISO), readMinutes, tags[], cover, author, content (JSX or string of HTML) }

export const blogPosts = [
  {
    slug: 'how-ai-coaching-changes-training',
    title: 'How AI coaching changes the way you train',
    excerpt: "Generic plans treat everyone the same. Context-aware coaching uses your history, your injuries, your last session. Here's the difference.",
    date: '2026-05-12',
    readMinutes: 6,
    tags: ['AI Coach', 'Training Science'],
    // cover: '/assets/blog-ai-coach.jpg',  // add image to public/assets/ then uncomment
author: { name: 'Tarosh M.', role: 'Founder, FitNyx' },
    content: `
<p>Most fitness apps hand you a plan, then forget about you. <strong>FitNyx works the other way</strong>: every answer the AI Coach gives is grounded in the last 30 days of your training — what you lifted, what you skipped, what hurt.</p>

<h2>The problem with static plans</h2>
<p>Static plans assume you'll execute perfectly. You won't. You'll travel, get sick, sleep four hours, tweak a hamstring. A coach that doesn't see that drift can't correct it.</p>

<h2>What context-aware means</h2>
<ul>
  <li><strong>Recent session history.</strong> The Coach knows you skipped legs Monday and asks why before it programs Friday.</li>
  <li><strong>Injury awareness.</strong> Tag a tweak — the Coach routes around it for the next 10 days automatically.</li>
  <li><strong>Goal phase.</strong> Cut, bulk, maintain. Same lift, different cues.</li>
</ul>

<h2>Concrete example</h2>
<p>Ask: <em>"Should I push squats today?"</em></p>
<p>Generic answer: "Yes, follow the plan."</p>
<p>FitNyx answer: <em>"You did 5×5 at 105 kg Tuesday and noted hamstring tightness. Front-load 12 min posterior chain mobility, then RDLs at 70%. Skip back squats this session — bench is fresh, take that instead."</em></p>
<p>Same data your gym partner would use. Available at 6 a.m. without a phone call.</p>
    `,
  },
  {
    slug: 'progressive-overload-without-burnout',
    title: 'Progressive overload without burnout: the volume vs. intensity trap',
    excerpt: 'Adding weight every week is the easy version. The version that actually keeps working past month three is harder — and the data shows why.',
    date: '2026-04-29',
    readMinutes: 8,
    tags: ['Training Science', 'Programming'],
    // cover: '/assets/blog-progressive-overload.jpg',  // add image to public/assets/ then uncomment
    author: { name: 'Tarosh M.', role: 'Founder, FitNyx' },
    content: `
<p>"Add 2.5 kg every week" works until it doesn't. Usually somewhere between week 6 and week 12 your bar speed slows, sleep gets worse, motivation tanks. That isn't laziness — it's a programming bug.</p>

<h2>Volume is the lever you forget</h2>
<p>Intensity (weight on the bar) is what you remember. Volume (sets × reps × weight) is what your body actually adapts to. Strong intermediates run flat intensity for weeks while ratcheting up volume — then deload — then push intensity.</p>

<h2>Three signals that you're overshooting</h2>
<ul>
  <li>Bar speed drops on the same weight you hit clean last week.</li>
  <li>Resting heart rate creeps up 5+ bpm over baseline.</li>
  <li>You start dreading sessions you used to look forward to.</li>
</ul>

<h2>What FitNyx tracks automatically</h2>
<p>Volume per movement, week over week. When the Coach sees volume up 18% AND a missed session, it flags a deload instead of stacking more weight. That's the whole game: <strong>knowing when to back off so you can push harder later</strong>.</p>
    `,
  },
  {
    slug: 'nutrition-that-supports-the-goal',
    title: 'Nutrition that actually supports the goal — not just the calories',
    excerpt: 'Hitting your calorie target while sleeping four hours and eating 60g of protein is not the same as a real cut. Macros and timing matter.',
    date: '2026-04-14',
    readMinutes: 5,
    tags: ['Nutrition', 'Recovery'],
    // cover: '/assets/blog-nutrition.jpg',  // add image to public/assets/ then uncomment
    author: { name: 'Tarosh M.', role: 'Founder, FitNyx' },
    content: `
<p>Calorie tracking apps got one thing right: input matters. They got the rest wrong: a 2,200 kcal day of donuts and a 2,200 kcal day of chicken, rice, and greens do not produce the same body.</p>

<h2>Protein is the floor, not the ceiling</h2>
<p>For most lifters, 1.6–2.2 g of protein per kg bodyweight is the band where muscle gain is supported without diminishing returns. Hit the floor every day before you worry about anything else.</p>

<h2>Carbs around training</h2>
<p>Carbs are not the enemy on a cut — they're the fuel that lets you keep lifting hard while in deficit. Front-load them around your session. Trim them from the meals nowhere near it.</p>

<h2>Fat keeps hormones honest</h2>
<p>Drop fat too low (under ~0.6 g/kg) and testosterone, sleep, and mood all drag. Stay above the floor even on aggressive cuts.</p>

<h2>FitNyx's nutrition planning</h2>
<p>Pick goal (bulk, cut, maintain), enter restrictions, get a macro target tied to your training week. Regenerate when your week looks different.</p>
    `,
  },
]

export function getPost(slug) {
  return blogPosts.find((p) => p.slug === slug) || null
}

export function getAllPostsSortedByDate() {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1))
}
