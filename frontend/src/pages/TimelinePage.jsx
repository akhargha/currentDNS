import TimelinePlaceholder from '../components/dashboard/TimelinePlaceholder'

function TimelinePage() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Timeline</h2>
      <p className="opacity-80">
        Placeholder timeline for first seen, latest valid, broken timestamps, and TXT snapshots.
      </p>
      {/* TODO: Replace mock timeline with backend proof history records. */}
      <TimelinePlaceholder />
    </section>
  )
}

export default TimelinePage
