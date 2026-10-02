import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'
import JSZip from 'jszip'

const ESCALA = 2.5 // ~240 dpi em A4

async function capturarPaginas(raiz, onProgresso) {
  await document.fonts?.ready
  const paginas = Array.from(raiz.querySelectorAll('[data-pagina]'))
  const canvases = []
  for (let i = 0; i < paginas.length; i++) {
    onProgresso?.(i + 1, paginas.length)
    const pag = paginas[i]
    const canvas = await html2canvas(pag, {
      scale: ESCALA,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      // A pré-visualização é reduzida com transform; na cópia usada para captura, voltamos à escala real
      onclone: (doc) => {
        doc.querySelectorAll('[data-escala]').forEach((el) => {
          el.style.transform = 'none'
        })
        doc.querySelectorAll('[data-pagina]').forEach((el) => {
          el.style.boxShadow = 'none'
          el.style.margin = '0'
        })
      },
    })
    canvases.push(canvas)
  }
  return canvases
}

function baixar(blob, nome) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = nome
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}

const paraBlob = (canvas, tipo = 'image/png', q) => new Promise((r) => canvas.toBlob(r, tipo, q))

export async function exportarPDF(raiz, nomeBase, onProgresso) {
  const canvases = await capturarPaginas(raiz, onProgresso)
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })
  canvases.forEach((c, i) => {
    if (i > 0) pdf.addPage()
    pdf.addImage(c.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297, undefined, 'FAST')
  })
  pdf.setProperties({ title: nomeBase, author: 'Andrade Macedo Serviços de Engenharia' })
  baixar(pdf.output('blob'), `${nomeBase}.pdf`)
}

export async function exportarPNGs(raiz, nomeBase, onProgresso) {
  const canvases = await capturarPaginas(raiz, onProgresso)
  const zip = new JSZip()
  for (let i = 0; i < canvases.length; i++) {
    zip.file(`${nomeBase}-pag-${String(i + 1).padStart(2, '0')}.png`, await paraBlob(canvases[i]))
  }
  baixar(await zip.generateAsync({ type: 'blob' }), `${nomeBase}-PNG.zip`)
}

export async function exportarPNGUnico(raiz, nomeBase, onProgresso) {
  const canvases = await capturarPaginas(raiz, onProgresso)
  const gap = Math.round(24 * ESCALA)
  const w = canvases[0].width
  const h = canvases.reduce((s, c) => s + c.height, 0) + gap * (canvases.length - 1)
  // Limita a ~16 megapixels (limite de canvas do Safari/iPhone)
  const f = Math.min(1, Math.sqrt(16e6 / (w * h)))
  const out = document.createElement('canvas')
  out.width = Math.floor(w * f)
  out.height = Math.floor(h * f)
  const ctx = out.getContext('2d')
  ctx.fillStyle = '#E9E4DA'
  ctx.fillRect(0, 0, out.width, out.height)
  let y = 0
  for (const c of canvases) {
    ctx.drawImage(c, 0, y * f, c.width * f, c.height * f)
    y += c.height + gap
  }
  baixar(await paraBlob(out), `${nomeBase}.png`)
}
