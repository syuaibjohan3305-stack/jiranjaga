import {
  buddyRepliedInTime,
  confirmSafe,
  dispatchGuard,
  familyAlerted,
  familyDueAt,
  formatClock,
  guardAlerted,
  guardDueAt,
  needsHelp,
  useJiranJaga,
} from '../lib/store.js'

function Guardhouse() {
  const data = useJiranJaga()
  const { clock, sos, checkedIn, buddyGoing, guardDispatched, safe, safeBy } = data
  const alerted = guardAlerted(data)
  const buddyHandling = needsHelp(data) && !alerted

  let status = { label: 'Waiting', color: 'bg-slate-200 text-slate-700' }
  if (checkedIn) status = { label: 'Checked in', color: 'bg-emerald-100 text-emerald-800' }
  if (safe) status = { label: `Safe (${safeBy})`, color: 'bg-emerald-100 text-emerald-800' }
  if (buddyHandling) status = { label: 'Buddy alerted', color: 'bg-amber-100 text-amber-900' }
  if (alerted) status = { label: sos ? 'SOS' : 'Guardhouse', color: 'bg-red-600 text-white' }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <a href="#/" className="text-xs text-slate-400 hover:text-white">
              ← Back to home
            </a>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">JiranJaga · Guardhouse</p>
            <h1 className="text-xl font-bold">Pondok Pengawal Utama · Taman Harmoni</h1>
          </div>
          <p className="font-mono text-2xl font-bold tabular-nums">{formatClock(clock)}</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <section>
          <h2 className="mb-3 font-bold">Alerts</h2>

          {alerted && (
            <div className="rounded-xl bg-red-50 p-5 ring-2 ring-red-300">
              <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                {sos
                  ? '🆘 SOS pressed'
                  : buddyRepliedInTime(data)
                    ? '⚠️ Kak Aina went to check but hasn’t confirmed in 15 minutes'
                    : '⚠️ No response from Kak Aina in 20 minutes'}
              </p>
              <p className="mt-1 text-xl font-bold">Mak Cik Rosnah · No. 12, Jalan Melati 3</p>
              <p className="text-sm text-slate-600">
                74 · lives alone · {sos ? `SOS at ${formatClock(data.sosAt)}` : 'missed the 10:00 am check-in'}
              </p>

              {guardDispatched && (
                <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-800 ring-1 ring-red-200">
                  🛡️ Guard dispatched at {formatClock(data.guardAt)}
                </p>
              )}

              <p className="mt-2 text-sm text-red-800">
                {familyAlerted(data)
                  ? '👩 Family (Farah, 012-555 0201) has been alerted.'
                  : `👩 Family (Farah) will be alerted at ${formatClock(familyDueAt(data))} if not resolved.`}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {!guardDispatched && (
                  <button
                    type="button"
                    onClick={dispatchGuard}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-700"
                  >
                    🛡️ Hantar pengawal / Dispatch guard
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => confirmSafe('Pengawal')}
                  className="rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
                >
                  ✅ Selamat / Mark safe
                </button>
              </div>
            </div>
          )}

          {buddyHandling && (
            <div className="rounded-xl bg-amber-50 p-5 ring-1 ring-amber-300">
              <p className="font-bold">Mak Cik Rosnah missed her check-in. Kak Aina has been alerted.</p>
              <p className="mt-1 text-sm text-amber-900">
                {buddyGoing
                  ? `Kak Aina is on the way (since ${formatClock(data.buddyAt)}). If she hasn't confirmed by ${formatClock(guardDueAt(data))}, the guardhouse takes over.`
                  : `If she doesn't respond, the guardhouse takes over at ${formatClock(guardDueAt(data))}.`}
              </p>
            </div>
          )}

          {!needsHelp(data) && (
            <div className="rounded-xl bg-emerald-50 p-5 text-emerald-900 ring-1 ring-emerald-200">
              <p className="font-bold">✅ No open alerts</p>
              <p className="text-sm">Every senior is safe or still has time to check in.</p>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">Senior</th>
                <th className="px-4 py-2 font-medium">Buddy</th>
                <th className="px-4 py-2 font-medium">Check-in</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3">
                  <p className="font-medium">Rosnah binti Ahmad</p>
                  <p className="text-xs text-slate-500">74 · No. 12, Jalan Melati 3</p>
                </td>
                <td className="px-4 py-3 text-slate-600">Kak Aina (No. 14)</td>
                <td className="px-4 py-3 tabular-nums text-slate-600">
                  {checkedIn ? formatClock(data.checkInAt) : '–'}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}>
                    {status.label}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

export default Guardhouse
