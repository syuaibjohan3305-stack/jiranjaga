import { useEffect, useState } from 'react'
import PhoneFrame from '../components/PhoneFrame.jsx'
import {
  DEADLINE_AT,
  REMINDER_AT,
  checkIn,
  formatClock,
  sendSos,
  useJiranJaga,
} from '../lib/store.js'

function Bubble({ mine = false, time, children }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-[15px] leading-snug shadow-sm ${
          mine ? 'rounded-tr-none bg-[#d9fdd3]' : 'rounded-tl-none bg-white'
        }`}
      >
        {children}
        <p className="mt-1 text-right text-[11px] text-slate-500">
          {time} {mine && <span className="text-sky-500">✓✓</span>}
        </p>
      </div>
    </div>
  )
}

function buildMessages(d) {
  const messages = []
  const add = (key, at, mine, content) => messages.push({ key, at, mine, content })

  if (d.clock >= REMINDER_AT) {
    add('reminder', REMINDER_AT, false, (
      <>
        <p>Selamat pagi, Mak Cik Rosnah! 🌞</p>
        <p>Tekan ✅ Saya OK jika anda sihat hari ini.</p>
        <p className="mt-2 text-slate-600">Good morning! Tap Saya OK if you're well today.</p>
      </>
    ))
  }

  const repliedBefore10 = (d.checkedIn && d.checkInAt < DEADLINE_AT) || (d.sos && d.sosAt < DEADLINE_AT)
  if (d.clock >= DEADLINE_AT && !repliedBefore10) {
    add('missed', DEADLINE_AT, false, (
      <>
        <p>Kami belum terima "Saya OK" daripada anda. Kak Aina akan menjenguk anda sebentar lagi.</p>
        <p className="mt-2 text-slate-600">We haven't heard from you, so Kak Aina will drop by.</p>
      </>
    ))
  }

  if (d.checkedIn) {
    add('checkin', d.checkInAt, true, <p>✅ Saya OK</p>)
    add('checkin-reply', d.checkInAt, false, <p>Terima kasih! Kak Aina dan Farah tahu anda selamat hari ini 💚</p>)
  }

  if (d.sos) {
    add('sos', d.sosAt, true, <p>🆘 Saya perlukan bantuan / I need help</p>)
    add('sos-reply', d.sosAt, false, (
      <>
        <p>🚨 Bantuan dalam perjalanan. Kak Aina, pengawal dan Farah telah dimaklumkan.</p>
        <p className="mt-2 text-slate-600">Help is coming. Kak Aina, the guardhouse and Farah have been alerted.</p>
      </>
    ))
  }

  if (d.buddyGoing) {
    add('buddy', d.buddyAt, false, (
      <>
        <p>🚶 Kak Aina sedang datang menjenguk anda.</p>
        <p className="mt-2 text-slate-600">Kak Aina is on the way.</p>
      </>
    ))
  }

  if (d.guardDispatched) {
    add('guard', d.guardAt, false, (
      <>
        <p>🛡️ Pengawal sedang dalam perjalanan ke rumah anda.</p>
        <p className="mt-2 text-slate-600">A guard is on the way to your house.</p>
      </>
    ))
  }

  if (d.safe) {
    add('safe', d.safeAt, false, (
      <>
        <p>💚 {d.safeBy} mengesahkan anda selamat. Jaga diri!</p>
        <p className="mt-2 text-slate-600">
          {d.safeBy === 'Pengawal' ? 'The guard' : d.safeBy} confirmed you're safe. Take care!
        </p>
      </>
    ))
  }

  return messages.sort((a, b) => a.at - b.at)
}

function Senior() {
  const data = useJiranJaga()
  const { clock, checkedIn: done, sos: sosSent, safe } = data
  const messages = buildMessages(data)
  const sosOpen = sosSent && !safe

  const [sosArmed, setSosArmed] = useState(false)

  useEffect(() => {
    if (!sosArmed) return
    const timer = setTimeout(() => setSosArmed(false), 4000)
    return () => clearTimeout(timer)
  }, [sosArmed])

  function handleSos() {
    if (sosArmed) {
      sendSos()
      setSosArmed(false)
    } else {
      setSosArmed(true)
    }
  }

  return (
    <PhoneFrame label="Mak Cik Rosnah's phone">
      <div className="flex items-center gap-3 bg-[#075e54] px-3 py-2.5 text-white">
        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500 text-lg">🏡</div>
        <div>
          <p className="font-semibold leading-tight">JiranJaga</p>
          <p className="text-xs text-emerald-100">Akaun rasmi · Jalan Melati 3</p>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto bg-[#efeae2] px-3 py-4">
        <p className="mx-auto w-fit rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-500 shadow-sm">
          Friday, 23 October
        </p>

        {clock < REMINDER_AT && (
          <p className="pt-10 text-center text-sm text-slate-500">
            Peringatan harian pada 9:00 pagi.
            <br />
            Daily reminder at 9:00 am.
          </p>
        )}

        {messages.map((m) => (
          <Bubble key={m.key} mine={m.mine} time={formatClock(m.at)}>
            {m.content}
          </Bubble>
        ))}
      </div>

      <div className="space-y-2 border-t border-slate-200 bg-slate-50 p-3">
        <button
          type="button"
          onClick={checkIn}
          disabled={done}
          className="flex h-16 w-full items-center justify-center rounded-2xl bg-emerald-600 text-xl font-bold text-white shadow active:scale-[0.98] disabled:bg-emerald-100 disabled:text-emerald-800 disabled:shadow-none"
        >
          {done ? '✅ Sudah daftar masuk hari ini' : '✅ Saya OK'}
        </button>
        <button
          type="button"
          onClick={handleSos}
          disabled={sosOpen}
          className={`flex h-14 w-full items-center justify-center rounded-2xl text-lg font-bold text-white shadow active:scale-[0.98] disabled:opacity-60 ${
            sosArmed ? 'animate-pulse bg-red-800' : 'bg-red-600'
          }`}
        >
          {sosOpen ? '🚨 Bantuan sedang datang' : sosArmed ? 'Tekan lagi untuk hantar SOS' : '🆘 SOS · Perlukan bantuan'}
        </button>
      </div>
    </PhoneFrame>
  )
}

export default Senior
