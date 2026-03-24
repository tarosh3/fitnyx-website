import { useCountUp } from '../hooks/useCountUp'

function Stat({ target, suffix, label, delay }) {
  const { ref, value } = useCountUp(target)

  return (
    <div className="sbi rv" ref={ref} style={{ transitionDelay: delay }}>
      <div className="sbn">
        {value}<span>{suffix}</span>
      </div>
      <div className="sbl">{label}</div>
    </div>
  )
}

export default function StatsBand() {
  return (
    <div className="sband">
      <Stat target={1} suffix="K+" label="Early Users" delay="0s" />
      <Stat target={50} suffix="K+" label="Workouts Logged" delay=".08s" />
      <Stat target={4.9} suffix="★" label="User Rating" delay=".16s" />
      <Stat target={3} suffix="x" label="More Consistent" delay=".24s" />
    </div>
  )
}
