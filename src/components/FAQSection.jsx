import { useState } from 'react'
import { faqs } from '../data/faqs'


export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (i) => {
    setOpenIdx(openIdx === i ? null : i)
  }

  return (
    <div className="std-section" id="faq-s">
      <div className="si-inner" style={{ maxWidth: 740 }}>
        <div style={{ textAlign: 'center', marginBottom: 46 }}>
          <span className="slbl rv">Questions</span>
          <h2 className="stit rv" style={{ textAlign: 'center', margin: '0 auto', transitionDelay: '.08s' }}>
            Frequently asked <em>questions</em>
          </h2>
        </div>
        <div>
          {faqs.map((faq, i) => (
            <div className={`fi${openIdx === i ? ' op' : ''}`} key={i}>
              <button className="fq" onClick={() => toggle(i)}>
                {faq.q} <span className="fqi">+</span>
              </button>
              <div className="fa">
                <div className="fai">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
