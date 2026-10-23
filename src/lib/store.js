import { useSyncExternalStore } from 'react'

const KEY = 'jiranjaga'

export const REMINDER_AT = 9 * 60
export const DEADLINE_AT = 10 * 60
export const BUDDY_MINUTES = 20
export const BUDDY_CONFIRM_MINUTES = 15
export const GUARD_MINUTES = 20

const START = {
  clock: 8 * 60 + 55,
  checkedIn: false,
  sos: false,
  buddyGoing: false,
  guardDispatched: false,
  safe: false,
  safeBy: null,
  checkInAt: null,
  sosAt: null,
  buddyAt: null,
  guardAt: null,
  safeAt: null,
}

function load() {
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? { ...START, ...JSON.parse(saved) } : START
  } catch {
    return START
  }
}

let data = load()
const listeners = new Set()

function save(next) {
  data = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
  listeners.forEach((redraw) => redraw())
}

window.addEventListener('storage', (event) => {
  if (event.key !== KEY) return
  data = load()
  listeners.forEach((redraw) => redraw())
})

export function checkIn() {
  save({ ...data, checkedIn: true, checkInAt: data.clock })
}

export function sendSos() {
  save({ ...data, sos: true, sosAt: data.clock, buddyGoing: false, guardDispatched: false, safe: false, safeBy: null })
}

export function buddyOnTheWay() {
  save({ ...data, buddyGoing: true, buddyAt: data.clock })
}

export function dispatchGuard() {
  save({ ...data, guardDispatched: true, guardAt: data.clock })
}

export function confirmSafe(by) {
  save({ ...data, safe: true, safeBy: by, safeAt: data.clock })
}

export function advanceClock(minutes) {
  save({ ...data, clock: data.clock + minutes })
}

export function resetDemo() {
  save(START)
}

export function missedCheckIn(d) {
  return !d.checkedIn && d.clock >= DEADLINE_AT
}

export function needsHelp(d) {
  return (d.sos || missedCheckIn(d)) && !d.safe
}

export function alertStartedAt(d) {
  return d.sos ? d.sosAt : DEADLINE_AT
}

export function buddyRepliedInTime(d) {
  return d.buddyGoing && d.buddyAt < alertStartedAt(d) + BUDDY_MINUTES
}

export function guardDueAt(d) {
  const noReplyDeadline = alertStartedAt(d) + BUDDY_MINUTES
  if (!buddyRepliedInTime(d)) return noReplyDeadline
  return Math.max(noReplyDeadline, d.buddyAt + BUDDY_CONFIRM_MINUTES)
}

export function guardAlerted(d) {
  if (!needsHelp(d)) return false
  if (d.sos || d.guardDispatched) return true
  return d.clock >= guardDueAt(d)
}

export function guardAlertedAt(d) {
  return d.sos ? d.sosAt : guardDueAt(d)
}

export function familyDueAt(d) {
  return guardAlertedAt(d) + GUARD_MINUTES
}

export function familyAlerted(d) {
  if (!guardAlerted(d)) return false
  if (d.sos) return true
  return d.clock >= familyDueAt(d)
}

export function formatClock(minutes) {
  const h = Math.floor(minutes / 60)
  const m = String(minutes % 60).padStart(2, '0')
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m} ${h < 12 ? 'am' : 'pm'}`
}

export function useJiranJaga() {
  return useSyncExternalStore(
    (redraw) => {
      listeners.add(redraw)
      return () => listeners.delete(redraw)
    },
    () => data,
  )
}
