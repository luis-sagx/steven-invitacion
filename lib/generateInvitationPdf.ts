import { jsPDF } from 'jspdf'

async function loadImage(src: string): Promise<string> {
  const res = await fetch(src)
  const blob = await res.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}

export async function generateInvitationPdf() {
  const monoDataUrl = await loadImage('/mono.png')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210
  const H = 297
  const CX = W / 2

  // ─── Background ─────────────────────────────────────────────────────────────
  doc.setFillColor(5, 10, 24)
  doc.rect(0, 0, W, H, 'F')

  // Dot grid
  doc.setFillColor(79, 109, 122)
  for (let x = 12; x < W; x += 14) {
    for (let y = 12; y < H; y += 14) {
      doc.circle(x, y, 0.3, 'F')
    }
  }

  // ─── Card ───────────────────────────────────────────────────────────────────
  const cX = 14
  const cY = 18
  const cW = W - 28
  const cH = H - 36
  doc.setFillColor(14, 22, 45)
  doc.setDrawColor(79, 109, 122)
  doc.setLineWidth(0.3)
  doc.roundedRect(cX, cY, cW, cH, 3, 3, 'FD')

  // Top accent line
  doc.setDrawColor(79, 109, 122)
  doc.setLineWidth(0.6)
  doc.line(cX + 20, cY + 5, cX + cW - 20, cY + 5)

  // ─── DNA helix ──────────────────────────────────────────────────────────────
  let curY = cY + 18
  drawHelix(doc, CX, curY)
  curY += 16

  // ─── "INVITACIÓN" ───────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(203, 213, 225)
  doc.text('INVITACIÓN', CX, curY, { align: 'center' })
  curY += 5

  // Short rule
  doc.setDrawColor(79, 109, 122)
  doc.setLineWidth(0.4)
  doc.line(CX - 12, curY, CX + 12, curY)
  curY += 10

  // ─── Subtitle ───────────────────────────────────────────────────────────────
  doc.setFont('times', 'italic')
  doc.setFontSize(13)
  doc.setTextColor(203, 213, 225)
  doc.text('Defensa de Proyecto de Titulación', CX, curY, { align: 'center' })
  curY += 13

  // ─── Name ───────────────────────────────────────────────────────────────────
  doc.setFont('times', 'bold')
  doc.setFontSize(34)
  doc.setTextColor(255, 255, 255)
  doc.text('Steven Sagnay', CX, curY, { align: 'center' })
  curY += 9

  // ─── Degree ──────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(148, 163, 184)
  doc.text('INGENIERÍA EN BIOTECNOLOGÍA', CX, curY, { align: 'center' })
  curY += 12

  // ─── Full-width divider ──────────────────────────────────────────────────────
  doc.setDrawColor(79, 109, 122)
  doc.setLineWidth(0.15)
  doc.line(cX + 10, curY, CX - 8, curY)
  doc.line(CX + 8, curY, cX + cW - 10, curY)
  doc.setFillColor(79, 109, 122)
  doc.circle(CX, curY, 1.5, 'F')
  curY += 10

  // ─── Info rows (full width, stacked) ─────────────────────────────────────────
  const rowH = 22
  const rowGap = 5
  const rowX = cX + 10
  const rowW = cW - 20

  const rows = [
    { icon: 'calendar', label: 'FECHA',      value: '25 de Febrero, 2026' },
    { icon: 'clock',    label: 'HORA',       value: '12:00 PM'            },
    { icon: 'location', label: 'LUGAR',      value: 'Universidad ESPE  ·  Salón 2001' },
  ]

  rows.forEach((row) => {
    // Row card background
    doc.setFillColor(8, 14, 30)
    doc.setDrawColor(79, 109, 122)
    doc.setLineWidth(0.18)
    doc.roundedRect(rowX, curY, rowW, rowH, 2, 2, 'FD')

    // Left coloured accent bar
    doc.setFillColor(79, 109, 122)
    doc.roundedRect(rowX, curY, 3, rowH, 1, 1, 'F')

    // Icon (centered vertically in row)
    const iconCX = rowX + 16
    const iconCY = curY + rowH / 2
    doc.setDrawColor(203, 213, 225)
    doc.setLineWidth(0.6)
    drawIcon(doc, row.icon, iconCX, iconCY)

    // Label (small, left-aligned above value)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(100, 116, 139)
    doc.text(row.label, rowX + 28, curY + rowH / 2 - 2.5)

    // Value (larger, bold)
    doc.setFont('times', 'normal')
    doc.setFontSize(13)
    doc.setTextColor(255, 255, 255)
    doc.text(row.value, rowX + 28, curY + rowH / 2 + 5)

    curY += rowH + rowGap
  })

  curY += 4

  // ─── Decorative divider ───────────────────────────────────────────────────────
  doc.setDrawColor(79, 109, 122)
  doc.setLineWidth(0.15)
  doc.line(cX + 10, curY, CX - 8, curY)
  doc.line(CX + 8, curY, cX + cW - 10, curY)
  doc.setFillColor(79, 109, 122)
  doc.circle(CX, curY, 1.5, 'F')
  curY += 12

  // ─── mono.png ────────────────────────────────────────────────────────────────
  const monoSize = 28
  doc.addImage(monoDataUrl, 'PNG', CX - monoSize / 2, curY, monoSize, monoSize)
  curY += monoSize + 10

  // ─── "TU PRESENCIA ES UN HONOR" ─────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(203, 213, 225)
  doc.text('TU PRESENCIA ES UN HONOR', CX, curY, { align: 'center' })
  curY += 18

  // ─── Decorative icons ────────────────────────────────────────────────────────
  const sp = 22
  doc.setDrawColor(100, 116, 139)
  doc.setLineWidth(0.55)
  drawMicroscope(doc, CX - sp, curY)
  drawHelixSmall(doc, CX, curY)
  drawFlask(doc, CX + sp, curY)

  // ─── Bottom accent line ───────────────────────────────────────────────────────
  doc.setDrawColor(79, 109, 122)
  doc.setLineWidth(0.6)
  doc.line(cX + 20, cY + cH - 5, cX + cW - 20, cY + cH - 5)

  // ─── Footer ──────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(100, 116, 139)
  doc.text(
    '25-02-2026  ·  DEFENSA DE TESIS  ·  STEVEN SAGNAY  ·  ESPE',
    CX,
    H - 22,
    { align: 'center' },
  )

  doc.save('Invitacion-Steven-Sagnay.pdf')
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function drawHelix(doc: jsPDF, cx: number, topY: number) {
  const steps = 12
  const amplitude = 5
  const segH = 1.1
  for (let i = 0; i < steps; i++) {
    const y0 = topY + i * segH
    const y1 = y0 + segH
    const a0 = (i / steps) * Math.PI * 2
    const a1 = ((i + 1) / steps) * Math.PI * 2
    const lx0 = cx + Math.sin(a0) * amplitude
    const lx1 = cx + Math.sin(a1) * amplitude
    const rx0 = cx - Math.sin(a0) * amplitude
    const rx1 = cx - Math.sin(a1) * amplitude
    doc.setDrawColor(148, 163, 184)
    doc.setLineWidth(0.5)
    doc.line(lx0, y0, lx1, y1)
    doc.line(rx0, y0, rx1, y1)
    if (i % 3 === 1) {
      doc.setDrawColor(79, 109, 122)
      doc.setLineWidth(0.28)
      doc.line(lx0, y0, rx0, y0)
    }
  }
}

function drawHelixSmall(doc: jsPDF, cx: number, cy: number) {
  doc.setLineWidth(0.45)
  const steps = 8
  const amplitude = 3
  const segH = 0.9
  for (let i = 0; i < steps; i++) {
    const y0 = cy - (steps * segH) / 2 + i * segH
    const y1 = y0 + segH
    const a0 = (i / steps) * Math.PI * 2
    const a1 = ((i + 1) / steps) * Math.PI * 2
    const lx0 = cx + Math.sin(a0) * amplitude
    const lx1 = cx + Math.sin(a1) * amplitude
    const rx0 = cx - Math.sin(a0) * amplitude
    const rx1 = cx - Math.sin(a1) * amplitude
    doc.line(lx0, y0, lx1, y1)
    doc.line(rx0, y0, rx1, y1)
    if (i % 2 === 0) {
      doc.setLineWidth(0.18)
      doc.line(lx0, y0, rx0, y0)
      doc.setLineWidth(0.45)
    }
  }
}

function drawIcon(doc: jsPDF, type: string, cx: number, cy: number) {
  doc.setLineWidth(0.65)
  if (type === 'calendar') {
    doc.rect(cx - 4, cy - 3.5, 8, 7)
    doc.line(cx - 4, cy - 1, cx + 4, cy - 1)
    doc.line(cx - 1.8, cy - 5.5, cx - 1.8, cy - 3.5)
    doc.line(cx + 1.8, cy - 5.5, cx + 1.8, cy - 3.5)
  } else if (type === 'clock') {
    doc.circle(cx, cy, 4.2)
    doc.line(cx, cy, cx, cy - 2.8)
    doc.line(cx, cy, cx + 2.2, cy + 1.5)
  } else if (type === 'location') {
    doc.circle(cx, cy - 2, 3)
    doc.lines([[0, 5]], cx, cy + 1)
  }
}

function drawMicroscope(doc: jsPDF, cx: number, cy: number) {
  doc.setLineWidth(0.55)
  doc.line(cx, cy - 6, cx, cy + 2)
  doc.line(cx - 3, cy + 2, cx + 3, cy + 2)
  doc.line(cx - 4, cy + 5, cx + 4, cy + 5)
  doc.line(cx - 4, cy + 2, cx - 4, cy + 5)
  doc.line(cx + 4, cy + 2, cx + 4, cy + 5)
  doc.circle(cx, cy - 7, 1.5)
  doc.line(cx - 2, cy - 4, cx + 2, cy - 4)
}

function drawFlask(doc: jsPDF, cx: number, cy: number) {
  doc.setLineWidth(0.55)
  doc.line(cx - 1.5, cy - 6, cx - 1.5, cy - 2)
  doc.line(cx + 1.5, cy - 6, cx + 1.5, cy - 2)
  doc.line(cx - 1.5, cy - 6, cx + 1.5, cy - 6)
  doc.line(cx - 1.5, cy - 2, cx - 5, cy + 4)
  doc.line(cx + 1.5, cy - 2, cx + 5, cy + 4)
  doc.line(cx - 5, cy + 4, cx + 5, cy + 4)
}
