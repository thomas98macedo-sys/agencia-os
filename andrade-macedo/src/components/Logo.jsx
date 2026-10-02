// Marca AM redesenhada em vetor a partir do logotipo oficial (public/logo-original.jpg)
export const BRAND = {
  blue: '#0A3F73',
  ink: '#1A2432',
  cream: '#FBF3E6',
}

export function LogoMark({ width = 120, blue = BRAND.blue, ink = BRAND.ink, style }) {
  return (
    <svg
      width={width}
      viewBox="200 262 852 456"
      style={{ display: 'block', ...style }}
      aria-label="Andrade Macedo"
      role="img"
    >
      <polygon fill={blue} points="208,553 620,272 620,435 410,588 410,713 208,713" />
      <polygon fill={ink} points="503,543 620,457 620,713 503,713" />
      <polygon fill={blue} points="635,268 822,407 822,713 635,713" />
      <polygon fill={ink} points="836,408 1045,270 1045,713 836,713" />
    </svg>
  )
}

export function LogoFull({ width = 320, showRule = true, subtitulo = 'Engenharia' }) {
  return (
    <div style={{ width, textAlign: 'center' }}>
      <LogoMark width={width * 0.78} style={{ margin: '0 auto' }} />
      {showRule && (
        <div style={{ height: Math.max(1, width / 520), background: BRAND.ink, margin: `${width * 0.055}px 0 ${width * 0.06}px` }} />
      )}
      <div
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          color: BRAND.blue,
          fontSize: width * 0.075,
          letterSpacing: '0.16em',
          whiteSpace: 'nowrap',
          lineHeight: 1,
          paddingLeft: '0.16em',
        }}
      >
        ANDRADE MACEDO
      </div>
      <div
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 500,
          color: BRAND.ink,
          fontSize: width * 0.045,
          letterSpacing: '0.2em',
          marginTop: width * 0.045,
          paddingLeft: '0.2em',
        }}
      >
        {subtitulo}
      </div>
    </div>
  )
}
