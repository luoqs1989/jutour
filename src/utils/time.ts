/** Minimal "HH:mm" time-of-day arithmetic for itinerary scheduling. */

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function minutesToTime(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function addMinutes(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes)
}

export interface TimeRange {
  id: string
  startTime: string
  endTime: string
}

/** Returns the ids of items whose time range overlaps a later item's start,
 * within the same day. Items are compared in the order given. */
export function findTimeConflicts(items: TimeRange[]): Set<string> {
  const sorted = [...items].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
  const conflicts = new Set<string>()
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i]
    const next = sorted[i + 1]
    if (timeToMinutes(current.endTime) > timeToMinutes(next.startTime)) {
      conflicts.add(current.id)
      conflicts.add(next.id)
    }
  }
  return conflicts
}
