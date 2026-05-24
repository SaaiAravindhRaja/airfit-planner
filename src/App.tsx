import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  CloudSun,
  Gauge,
  HeartPulse,
  HelpCircle,
  LayoutDashboard,
  Library,
  Sparkles,
  Wind,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'
import { airDataset, bodyDataset, type AirSeriesPoint, type MeasurementStat } from './data'

type Goal = 'focus' | 'movement' | 'recovery'
type Intensity = 'low' | 'medium' | 'high'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const percentile = (value: number, stat: MeasurementStat) => {
  if (value <= stat.p25) return clamp(((value - stat.min) / (stat.p25 - stat.min)) * 25, 1, 25)
  if (value <= stat.median) return 25 + ((value - stat.p25) / (stat.median - stat.p25)) * 25
  if (value <= stat.p75) return 50 + ((value - stat.median) / (stat.p75 - stat.median)) * 25
  return clamp(75 + ((value - stat.p75) / (stat.max - stat.p75)) * 25, 75, 99)
}

const goalCopy = {
  focus: {
    label: 'Deep work',
    title: '90-minute focus sprint',
    action: 'Start with a 10-minute reset walk, then run two 35-minute work blocks with a short breathing break between them.',
  },
  movement: {
    label: 'Movement',
    title: 'Low-friction training block',
    action: 'Do a 6-minute warmup, 22 minutes of steady movement, and a 5-minute cooldown with mobility work.',
  },
  recovery: {
    label: 'Recovery',
    title: 'Nervous-system downshift',
    action: 'Keep intensity low, use a 20-minute walk or stretch flow, and finish with a hydration and sleep prep checklist.',
  },
} satisfies Record<Goal, { label: string; title: string; action: string }>

const intensityWeight = {
  low: 0.9,
  medium: 1,
  high: 1.14,
} satisfies Record<Intensity, number>

const metricFormatter = new Intl.NumberFormat('en', { maximumFractionDigits: 1 })

function App() {
  const [height, setHeight] = useState(172)
  const [waist, setWaist] = useState(89)
  const [goal, setGoal] = useState<Goal>('movement')
  const [intensity, setIntensity] = useState<Intensity>('medium')
  const [pm25, setPm25] = useState(6)

  const heightStat = bodyDataset.measurements.find((item) => item.key === 'height')!
  const waistStat = bodyDataset.measurements.find((item) => item.key === 'waist')!

  const plan = useMemo(() => {
    const heightPercentile = percentile(height, heightStat)
    const waistPercentile = percentile(waist, waistStat)
    const airPenalty = clamp((pm25 - airDataset.parameters.pm25.median) * 2.4, 0, 28)
    const mobilityBonus = goal === 'recovery' ? 8 : goal === 'movement' ? 4 : 0
    const readiness = Math.round(clamp(91 - Math.abs(waistPercentile - 52) * 0.34 - airPenalty + mobilityBonus, 42, 98))
    const baseMinutes = goal === 'focus' ? 90 : goal === 'movement' ? 34 : 26
    const minutes = Math.round(baseMinutes * intensityWeight[intensity] - airPenalty * 0.35)
    const indoor = pm25 > airDataset.parameters.pm25.p75
    const airLabel = pm25 <= airDataset.parameters.pm25.median ? 'clear' : pm25 <= airDataset.parameters.pm25.p75 ? 'moderate' : 'elevated'

    return {
      readiness,
      minutes: clamp(minutes, 18, 100),
      heightPercentile: Math.round(heightPercentile),
      waistPercentile: Math.round(waistPercentile),
      indoor,
      airLabel,
      headline: readiness > 82 ? 'Strong day to execute' : readiness > 66 ? 'Good day with guardrails' : 'Keep it controlled today',
      environment: indoor
        ? 'Air quality is above the dataset upper quartile. Prefer indoor movement, closed windows, and lighter breathing load.'
        : 'Air quality is within the normal dataset band. Outdoor movement is reasonable if it matches your energy.',
    }
  }, [goal, height, heightStat, intensity, pm25, waist, waistStat])

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary">
        <div className="brand">
          <div className="brand-mark">AF</div>
          <div>
            <strong>AirFit Planner</strong>
            <span>Daily planning</span>
          </div>
        </div>

        <nav className="nav-list">
          <a href="#dashboard" className="active"><LayoutDashboard size={18} /> Dashboard</a>
          <a href="#data"><Library size={18} /> Data</a>
          <a href="#about"><HelpCircle size={18} /> About</a>
        </nav>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <h1>AirFit Planner</h1>
            <p>A small dashboard for adapting focus, movement, and recovery plans to body and air-quality context.</p>
          </div>
        </header>

        <section className="hero-grid" id="dashboard">
          <div className="planner-panel">
            <div className="section-title">
              <Sparkles size={20} />
              <h2>Plan inputs</h2>
            </div>

            <div className="controls-grid">
              <label>
                Height
                <span>{height} cm</span>
                <input type="range" min="145" max="198" value={height} onChange={(event) => setHeight(Number(event.target.value))} />
              </label>
              <label>
                Waist
                <span>{waist} cm</span>
                <input type="range" min="64" max="130" value={waist} onChange={(event) => setWaist(Number(event.target.value))} />
              </label>
              <label>
                PM2.5 today
                <span>{pm25} ug/m3</span>
                <input type="range" min="1" max="40" value={pm25} onChange={(event) => setPm25(Number(event.target.value))} />
              </label>
              <label>
                Session intensity
                <select value={intensity} onChange={(event) => setIntensity(event.target.value as Intensity)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>

            <div className="segmented" aria-label="Goal">
              {(Object.keys(goalCopy) as Goal[]).map((item) => (
                <button key={item} className={goal === item ? 'selected' : ''} onClick={() => setGoal(item)} type="button">
                  {goalCopy[item].label}
                </button>
              ))}
            </div>
          </div>

          <div className="recommendation-panel">
            <div className="score-row">
              <div>
                <span className="eyeline">Readiness score</span>
                <strong>{plan.readiness}</strong>
              </div>
              <Gauge size={42} />
            </div>
            <h2>{plan.headline}</h2>
            <p>{goalCopy[goal].action}</p>
            <div className="recommendation-actions">
              <span><CheckCircle2 size={17} /> {plan.minutes} minute plan</span>
              <span><Wind size={17} /> {plan.airLabel} air load</span>
            </div>
          </div>
        </section>

        <section className="output-grid" aria-label="Generated outputs">
          <OutputCard icon={<Brain />} label="Generated plan" title={goalCopy[goal].title} body={`Use a ${intensity} intensity setting and keep the session to ${plan.minutes} minutes today.`} />
          <OutputCard icon={<CloudSun />} label="Environment guidance" title={plan.indoor ? 'Move indoors' : 'Outdoor OK'} body={plan.environment} />
          <OutputCard icon={<Activity />} label="Body context" title={`${plan.waistPercentile}th percentile waist`} body={`Your height is around the ${plan.heightPercentile}th percentile in the reference dataset.`} />
        </section>

        <section className="data-grid" id="data">
          <div className="wide-panel">
            <div className="section-title">
              <BarChart3 size={20} />
              <h2>Air-quality trend</h2>
            </div>
            <TrendChart points={airDataset.series} />
          </div>

          <div className="stats-panel">
            <div className="section-title">
              <HeartPulse size={20} />
              <h2>Body dataset</h2>
            </div>
            <div className="stat-list">
              {bodyDataset.measurements.slice(0, 5).map((item) => (
                <div className="stat-row" key={item.key}>
                  <span>{item.label}</span>
                  <strong>{metricFormatter.format(item.median)} {item.unit}</strong>
                  <div className="range-track">
                    <i style={{ left: `${((item.median - item.min) / (item.max - item.min)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-panel" id="about">
          <div>
            <div className="section-title">
              <Sparkles size={20} />
              <h2>About</h2>
            </div>
            <p>Move the inputs to compare scenarios. The recommendations update instantly from compact summaries of the included reference data.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

function OutputCard({ icon, label, title, body }: { icon: React.ReactNode; label: string; title: string; body: string }) {
  return (
    <article className="output-card">
      <div className="card-icon">{icon}</div>
      <span>{label}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  )
}

function TrendChart({ points }: { points: AirSeriesPoint[] }) {
  const max = Math.max(...points.map((point) => point.pm10))

  return (
    <div className="trend-chart" aria-label="PM10 and PM2.5 trend chart">
      {points.map((point) => (
        <div className="trend-column" key={point.date}>
          <div className="bar-stack">
            <span className="pm10" style={{ height: `${(point.pm10 / max) * 100}%` }} />
            <span className="pm25" style={{ height: `${(point.pm25 / max) * 100}%` }} />
          </div>
          <small>{point.date.slice(5)}</small>
        </div>
      ))}
    </div>
  )
}

export default App
