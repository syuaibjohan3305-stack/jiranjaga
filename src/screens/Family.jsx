import PhoneFrame from '../components/PhoneFrame.jsx'
import {
  DEADLINE_AT,
  REMINDER_AT,
  buddyRepliedInTime,
  confirmSafe,
  familyAlerted,
  familyDueAt,
  formatClock,
  guardAlertedAt,
  needsHelp,
  useJiranJaga,
} from '../lib/store.js'

function buildTimeline(d) {
  const endedAt = Math.min(d.clock, d.safe ? d.safeAt : Infinity, d.checkedIn ? d.checkInAt : Infinity)
  const missed = !d.sos && !(d.checkedIn && d.checkInAt < DEADLINE_AT) && endedAt >= DEADLINE_AT
  const guardStep = missed && endedAt >= guardAlertedAt(d)
  const familyStep = guardStep && endedAt >= familyDueAt(d)
  const guardReason = buddyRepliedInTime(d)
    ? 'Kak Aina went to check but hasn’t confirmed. Guardhouse alerted.'
    : 'No reply from Kak Aina. Guardhouse alerted.'

  const events = []
  if (d.clock >= REMINDER_AT) events.push({ at: REMINDER_AT, icon: '🤖', text: 'Daily "Saya OK" reminder sent to Mak.' })
  if (d.checkedIn) events.push({ at: d.checkInAt, icon: '👵', text: 'Mak tapped "Saya OK".' })
  if (d.sos) events.push({ at: d.sosAt, icon: '🆘', text: 'Mak pressed SOS. Kak Aina, the guardhouse and you were alerted.' })
  if (missed) events.push({ at: DEADLINE_AT, icon: '🔔', text: 'No "Saya OK" by 10:00 am. Kak Aina (neighbour) alerted.' })
  if (d.buddyGoing) events.push({ at: d.buddyAt, icon: '🏘️', text: 'Kak Aina is on the way to check.' })
  if (guardStep) events.push({ at: guardAlertedAt(d), icon: '🛡️', text: guardReason })
  if (d.guardDispatched) events.push({ at: d.guardAt, icon: '🛡️', text: 'A guard was sent to the house.' })
  if (familyStep) events.push({ at: familyDueAt(d), icon: '🚨', text: 'Still unresolved. You were alerted.' })
  if (d.safe) events.push({ at: d.safeAt, icon: '💚', text: `${d.safeBy} confirmed Mak is safe.` })
  return events.sort((a, b) => a.at - b.at)
}

function Family() {
  const data = useJiranJaga()
  const { clock, checkedIn, sos, safe } = data
  const alerted = familyAlerted(data)
  const timeline = buildTimeline(data)

  let today = { text: 'Waiting for the 9:00 am reminder.', color: 'text-slate-500' }
  if (clock >= REMINDER_AT) today = { text: 'Reminder sent. Waiting for Mak to reply (by 10:00 am).', color: 'text-slate-700' }
  if (checkedIn) today = { text: `✅ Mak checked in at ${formatClock(data.checkInAt)}`, color: 'text-emerald-700' }
  if (needsHelp(data)) today = { text: 'Checking on Mak now…', color: 'text-amber-700' }
  if (safe) today = { text: `✅ ${data.safeBy} confirmed Mak is safe at ${formatClock(data.safeAt)}`, color: 'text-emerald-700' }

  return (
    <PhoneFrame label="Farah's phone (daughter, in Penang)">
      <div className="bg-rose-700 px-4 pb-4 pt-3 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-200">JiranJaga Family</p>
        <p className="text-xl font-bold">Mak Cik Rosnah</p>
        <p className="text-sm text-rose-100">No. 12, Jalan Melati 3, Taman Harmoni</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
        {alerted && (
          <div className="rounded-2xl bg-red-600 p-4 text-white shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-red-100">
              {sos ? '🆘 SOS' : '🚨 Tindakan diperlukan / Action needed'}
            </p>
            <p className="mt-1 text-lg font-bold leading-tight">
              {sos ? 'Mak menekan butang SOS.' : 'Mak belum dapat dihubungi.'}
            </p>
            <p className="text-sm text-red-50">
              {sos ? 'Mak pressed SOS.' : 'Nobody has reached Mak yet.'} The guardhouse is on it.
            </p>

            <div className="mt-3 space-y-2">
              <a
                href="tel:0125550101"
                className="flex h-12 items-center justify-center rounded-xl bg-white font-bold text-red-700"
              >
                📞 Hubungi Mak / Call Mum
              </a>
              <a
                href="tel:0355550100"
                className="flex min-h-12 items-center justify-center rounded-xl bg-red-800 px-3 py-2 text-center font-bold"
              >
                🛡️ Hubungi pondok pengawal / Call guardhouse
              </a>
              <button
                type="button"
                onClick={() => confirmSafe('Farah')}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-500 font-bold"
              >
                ✅ Mak selamat / Mum is safe
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Hari ini / Today</p>
          <p className={`mt-1 text-lg font-bold ${today.color}`}>{today.text}</p>
          {needsHelp(data) && !alerted && (
            <p className="mt-1 text-sm text-slate-500">
              You'll be alerted at {formatClock(familyDueAt(data))} if it's still not resolved.
            </p>
          )}
        </div>

        {timeline.length > 0 && (
          <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Apa yang berlaku / What happened</p>
            <ol className="mt-3 space-y-3 border-l-2 border-slate-200 pl-4">
              {timeline.map((e) => (
                <li key={`${e.at}-${e.text}`} className="relative">
                  <span className="absolute -left-[27px] flex size-5 items-center justify-center rounded-full bg-white text-xs ring-2 ring-slate-200">
                    {e.icon}
                  </span>
                  <p className="font-mono text-xs text-slate-400">{formatClock(e.at)}</p>
                  <p className="text-sm text-slate-800">{e.text}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Kampung Mak / Mum's village</p>
          <p className="mt-2 text-sm">🏘️ <b>Kak Aina</b>, neighbour buddy · No. 14</p>
          <p className="mt-1 text-sm">🛡️ <b>Pondok Pengawal Utama</b> · 03-5555 0100</p>
        </div>
      </div>
    </PhoneFrame>
  )
}

export default Family
