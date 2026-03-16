/**
 * HomePage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The homepage now uses the full cinematic BookScrollExperience as its hero.
 * Everything below the hero animation (stats, state compliance, features, CTA)
 * is rendered INSIDE BookScrollExperience via PostAnimationSections, so this
 * file simply mounts the single component.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import BookScrollExperience from '../animations/BookScrollExperience'

export default function HomePage() {
  return <BookScrollExperience />
}
