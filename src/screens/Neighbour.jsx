import PhoneFrame from '../components/PhoneFrame.jsx'
import {
  buddyOnTheWay,
  confirmSafe,
  formatClock,
  guardAlerted,
  guardDueAt,
  needsHelp,
  useJiranJaga,
} from '../lib/store.js'

function Neighbour() {
  const data = useJiranJaga()
  const { checkedIn, sos, buddyGoing, safe } = data
  const alert = needsHelp(data)

  const isSos = sos && !safe
  const card = isSos
    ? {
        color: 'bg-red-600 text-white',
        tag: '🆘 SOS',
        title: 'Mak Cik Rosnah (No. 12) perlukan bantuan!',
        text: "She pressed SOS. You're the closest neighbour.",
      }
    : {
        color: 'bg-amber-400 text-amber-950',
        tag: '🔔 Belum daftar masuk',
        title: 'Mak Cik Rosnah (No. 12) belum daftar masuk hari ini',
        text: "She hasn't tapped Saya OK by 10:00 am. Can you check on her?",
      }

  let status = { label: 'Waiting', color: 'bg-slate-200 text-slate-700' }
  if (checkedIn) status = { label: 'OK', color: 'bg-emerald-100 text-emerald-800' }
  if (safe) status = { label: 'Safe', color: 'bg-emerald-100 text-emerald-800' }
  if (alert) status = isSos ? { label: 'SOS', color: 'bg-red-600 text-white' } : { label: 'Missed', color: 'bg-amber-400 text-amber-950' }

  return (
    <PhoneFrame label="Kak Aina's phone (neighbour buddy)">
      <div className="bg-sky-700 px-4 pb-4 pt-3 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">Jiran Jaga</p>
        <p className="text-xl font-bold">Hai, Kak Aina 👋</p>
        <p className="text-sm text-sky-100">No. 14, Jalan Melati 3</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
        {alert && (
          <div className={`rounded-2xl p-4 shadow-lg ${card.color}`}>
            <p className="text-xs font-bold uppercase tracking-wide opacity-80">{card.tag}</p>
            <p className="mt-1 text-lg font-bold leading-tight">{card.title}</p>
            <p className="text-sm opacity-90">{card.text}</p>

            {buddyGoing && (
              <p className="mt-3 rounded-lg bg-black/10 px-3 py-2 text-sm font-semibold">
                🚶 Anda dalam perjalanan / You're on the way
              </p>
            )}

            {guardAlerted(data) ? (
              <p className="mt-3 rounded-lg bg-black/10 px-3 py-2 text-sm font-semibold">
                🛡️ Pondok pengawal telah dimaklumkan / The guardhouse has been alerted
              </p>
            ) : buddyGoing ? (
              <p className="mt-3 rounded-lg bg-black/10 px-3 py-2 text-sm">
                Sila sahkan sebelum / Please confirm by <b>{formatClock(guardDueAt(data))}</b>, or the guardhouse will
                be alerted
              </p>
            ) : (
              <p className="mt-3 rounded-lg bg-black/10 px-3 py-2 text-sm">
                Pengawal dimaklumkan pada / Guardhouse alerted at <b>{formatClock(guardDueAt(data))}</b>
              </p>
            )}

            <div className="mt-3 space-y-2">
              {!buddyGoing && (
                <button
                  type="button"
                  onClick={buddyOnTheWay}
                  className="flex h-14 w-full items-center justify-center rounded-xl bg-white text-base font-bold text-red-700 active:scale-[0.98]"
                >
                  🚶 Saya akan periksa / I'll check
                </button>
              )}
              <button
                type="button"
                onClick={() => confirmSafe('Kak Aina')}
                className="flex h-14 w-full items-center justify-center rounded-xl bg-emerald-500 text-base font-bold text-white active:scale-[0.98]"
              >
                ✅ Dia selamat / She's safe
              </button>
              <a
                href="tel:0125550101"
                className="flex h-11 items-center justify-center rounded-xl bg-red-800 text-sm font-bold text-white"
              >
                📞 Hubungi / Call 012-555 0101
              </a>
            </div>
          </div>
        )}

        {!alert && (
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-900 ring-1 ring-emerald-200">
            <p className="text-lg font-bold">Tiada amaran / No alerts</p>
            <p className="text-sm">We'll only notify you if Mak Cik Rosnah needs help.</p>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Warga emas saya / My seniors</p>
          <div className="flex items-center justify-between rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <div>
              <p className="font-semibold">Mak Cik Rosnah</p>
              <p className="text-xs text-slate-500">No. 12 · 74 years old · lives alone</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}>{status.label}</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

export default Neighbour
