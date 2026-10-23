import { formatClock, useJiranJaga } from '../lib/store.js'

function PhoneFrame({ label, children }) {
  const { clock } = useJiranJaga()

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-100 py-6">
      <a href="#/" className="mb-1 text-sm text-emerald-700 hover:underline">
        ← Back to home
      </a>
      <p className="mb-3 text-xs font-medium text-slate-500">{label}</p>

      <div className="flex h-[720px] w-[360px] flex-col overflow-hidden rounded-[2.5rem] border-[10px] border-slate-900 bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between bg-black px-6 py-1.5 text-xs font-semibold text-white">
          <span>{formatClock(clock)}</span>
          <span>▂▄▆ 5G ▮</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  )
}

export default PhoneFrame
