import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Documento, { PAGE_W } from './Documento.jsx'

export default function Visualizacao({ proposta, empresa, raizRef }) {
  const caixaRef = useRef(null)
  const docRef = useRef(null)
  const [escala, setEscala] = useState(1)
  const [altura, setAltura] = useState(0)

  useEffect(() => {
    const el = caixaRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width - 32
      setEscala(Math.min(1, w / PAGE_W))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (docRef.current) setAltura(docRef.current.offsetHeight)
  })

  return (
    <div className="visualizacao" ref={caixaRef}>
      <div style={{ height: altura * escala, width: PAGE_W * escala, margin: '0 auto' }}>
        <div
          ref={(el) => { docRef.current = el; if (raizRef) raizRef.current = el }}
          data-escala
          style={{ width: PAGE_W, transform: `scale(${escala})`, transformOrigin: 'top left' }}
        >
          <Documento proposta={proposta} empresa={empresa} />
        </div>
      </div>
    </div>
  )
}
