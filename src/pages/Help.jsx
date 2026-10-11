import PolicyPage from './PolicyPage'
import { faqs } from '../data/faqs'

// Linked from the app's Settings → Help & FAQ. Kept as a plain page so the
// prerender step ships real HTML (crawlers, slow phones).
export default function Help() {
  return (
    <PolicyPage title="Help & FAQ">
      <p>Quick answers to common questions about the FitNyx app. Can’t find what you need? Email <strong>support@fitnyx.in</strong> and we’ll get back to you.</p>

      <h2>Using the app</h2>
      <h3>How do I start a workout?</h3>
      <p>Open <strong>Workouts</strong>, pick a plan (or create your own), open a day and tap <strong>Start workout</strong>. Log each set as you go; FitNyx pre-fills your last weights and suggests when to progress.</p>
      <h3>What is Roam?</h3>
      <p>Roam records a run, walk or ride with GPS and draws your route on a map. It keeps recording with the screen locked. Travel in a car, train or metro is detected and isn’t counted toward your distance or XP.</p>
      <h3>My reminders arrive late or not at all</h3>
      <p>Make sure notifications are on in <strong>Settings → Notifications</strong>. On Android 12 and newer, open <strong>Settings → Reminders</strong> and allow “Alarms &amp; reminders” so they fire exactly on time.</p>
      <h3>How do I change my goals or experience level?</h3>
      <p>Go to <strong>Settings → Fitness Profile</strong>. The AI coach and your plans adapt to the new settings.</p>
      <h3>How do I delete my account?</h3>
      <p>In the app: <strong>Settings → Delete Account</strong>. You can also <a href="/delete-account">request deletion here</a>.</p>

      <h2>Frequently asked questions</h2>
      {faqs.map((f) => (
        <div key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}

      <h2>Contact</h2>
      <p>Email <a href="mailto:support@fitnyx.in">support@fitnyx.in</a> — include the email address on your FitNyx account so we can find it quickly.</p>
    </PolicyPage>
  )
}
