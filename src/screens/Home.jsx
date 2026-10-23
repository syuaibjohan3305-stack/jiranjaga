import DemoClock from '../components/DemoClock.jsx'
import logo from '../assets/logo.svg'
import { REMINDER_AT, familyAlerted, guardAlerted, needsHelp, useJiranJaga } from '../lib/store.js'

const ROLES = [
  {
    href: '#/senior',
    emoji: '👵',
    title: 'Senior',
    who: 'Mak Cik Rosnah, 74, lives alone',
    text: 'Taps "Saya OK" on WhatsApp every morning, or SOS if she needs help.',
  },
  {
    href: '#/neighbour',
    emoji: '🏘️',
    title: 'Neighbour buddy',
    who: 'Kak Aina, two doors away',
    text: 'Alerted first if Mak Cik Rosnah misses her check-in.',
  },
  {
    href: '#/guard',
    emoji: '🛡️',
    title: 'Guardhouse',
    who: 'Pondok Pengawal Utama',
    text: 'Steps in if the buddy doesn’t respond, and can send a guard.',
  },
  {
    href: '#/family',
    emoji: '👩‍👧',
    title: 'Family',
    who: 'Farah, daughter in Penang',
    text: 'Sees today’s status and is alerted last, with one-tap calling.',
  },
]

function statusOf(data) {
  if (familyAlerted(data) && !data.sos) return { label: '🚨 Still unresolved · Family alerted', color: 'bg-red-700 text-white' }
  if (needsHelp(data) && data.guardDispatched) return { label: '🛡️ Guard on the way', color: 'bg-red-100 text-red-800' }
  if (guardAlerted(data) && !data.sos)
    return {
      label: data.buddyGoing ? '🛡️ Kak Aina hasn’t confirmed · Guardhouse alerted' : '🛡️ No reply from Kak Aina · Guardhouse alerted',
      color: 'bg-red-600 text-white',
    }
  if (needsHelp(data) && data.buddyGoing) return { label: '🚶 Kak Aina on the way', color: 'bg-amber-100 text-amber-900' }
  if (needsHelp(data) && data.sos) return { label: '🆘 SOS sent', color: 'bg-red-600 text-white' }
  if (needsHelp(data)) return { label: '⚠️ Missed 10 am check-in · Kak Aina alerted', color: 'bg-amber-400 text-amber-950' }
  if (data.safe) return { label: `💚 Confirmed safe by ${data.safeBy}`, color: 'bg-emerald-100 text-emerald-800' }
  if (data.checkedIn) return { label: '✅ Checked in', color: 'bg-emerald-100 text-emerald-800' }
  if (data.clock >= REMINDER_AT) return { label: '⏳ Reminder sent, waiting', color: 'bg-slate-200 text-slate-700' }
  return { label: '🌙 Before 9 am reminder', color: 'bg-slate-100 text-slate-500' }
}

function Home() {
  const data = useJiranJaga()
  const status = statusOf(data)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-emerald-600 text-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-6">
          <img src={logo} alt="" className="size-14 rounded-2xl ring-2 ring-white/40" />
          <div>
            <h1 className="text-3xl font-bold">JiranJaga</h1>
            <p className="mt-1 text-emerald-100">Jiran prihatin, warga emas selamat.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="max-w-2xl text-lg text-slate-700">
          A daily “Saya OK” check-in for seniors who live alone. If they miss it, help comes from a neighbour first,
          then the township guardhouse, then the family, all within an hour.
        </p>

        <div className="mt-6">
          <DemoClock />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Today</p>
            <p className="font-bold">Mak Cik Rosnah · No. 12, Jalan Melati 3</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${status.color}`}>{status.label}</span>
        </div>

        <h2 className="mt-8 text-lg font-bold">Who uses JiranJaga</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((role) => (
            <a
              key={role.title}
              href={role.href}
              className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-emerald-400"
            >
              <span className="text-3xl">{role.emoji}</span>
              <p className="mt-3 font-bold">{role.title} →</p>
              <p className="text-sm font-medium text-slate-500">{role.who}</p>
              <p className="mt-2 text-sm text-slate-600">{role.text}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
