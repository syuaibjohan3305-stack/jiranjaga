import { advanceClock, formatClock, resetDemo, useJiranJaga } from '../lib/store.js'

function DemoClock() {
  const { clock } = useJiranJaga()
  const button = 'rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200'

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-900 p-4 text-white">
      <div className="mr-auto">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Demo clock</p>
        <p className="font-mono text-2xl font-bold tabular-nums">{formatClock(clock)}</p>
      </div>
      <button type="button" className={button} onClick={() => advanceClock(5)}>
        +5 min
      </button>
      <button type="button" className={button} onClick={() => advanceClock(30)}>
        +30 min
      </button>
      <button
        type="button"
        className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-300 ring-1 ring-slate-600 hover:bg-slate-800"
        onClick={resetDemo}
      >
        Reset to 8:55 am
      </button>
    </div>
  )
}

export default DemoClock
