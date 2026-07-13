/** Formats a duration for UI. @example formatDuration(90_000) // "1m 30s" */
function formatDuration(milliseconds: number): string {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) throw new RangeError("Duration must be a finite non-negative number.")
  if (milliseconds < 1000) return `${Math.floor(milliseconds)}ms`
  let seconds = Math.floor(milliseconds / 1000)
  const days = Math.floor(seconds / 86_400)
  seconds %= 86_400
  const hours = Math.floor(seconds / 3_600)
  seconds %= 3_600
  const minutes = Math.floor(seconds / 60)
  seconds %= 60
  return [[days, "d"], [hours, "h"], [minutes, "m"], [seconds, "s"]]
    .filter(([value]) => value)
    .map(([value, unit]) => `${value}${unit}`)
    .join(" ") || "0s"
}

export default formatDuration
