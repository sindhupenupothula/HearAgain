function Logo() {
  const micColor = '#000000'
  const heartColor = '#E63946'
  const strokeWidth = 4
  const sw = strokeWidth

  return (
    <svg
      width="320"
      height="260"
      viewBox="0 0 320 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left sound waves */}
      <path
        d="M 90 150 C 60 150, 45 190, 70 220"
        stroke={micColor}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 105 145 C 82 145, 70 180, 88 208"
        stroke={micColor}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 120 142 C 104 142, 96 170, 108 194"
        stroke={micColor}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
      />

      {/* Right sound waves */}
      <path
        d="M 230 150 C 260 150, 275 190, 250 220"
        stroke={micColor}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 215 145 C 238 145, 250 180, 232 208"
        stroke={micColor}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 200 142 C 216 142, 224 170, 212 194"
        stroke={micColor}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
      />

      {/* Mic mesh top - outer cap */}
      <path
        d="M 130 85 Q 160 40 190 85"
        stroke={micColor}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="130"
        y1="85"
        x2="190"
        y2="85"
        stroke={micColor}
        strokeWidth={sw}
        strokeLinecap="round"
      />

      {/* Mic mesh diamond pattern */}
      {/* Horizontal lines in cap */}
      <line x1="137" y1="78" x2="183" y2="78" stroke={micColor} strokeWidth={1.5} />
      <line x1="142" y1="68" x2="178" y2="68" stroke={micColor} strokeWidth={1.5} />
      <line x1="150" y1="58" x2="170" y2="58" stroke={micColor} strokeWidth={1.5} />
      {/* Vertical / diagonal mesh */}
      <line x1="138" y1="85" x2="155" y2="55" stroke={micColor} strokeWidth={1.5} />
      <line x1="150" y1="85" x2="160" y2="50" stroke={micColor} strokeWidth={1.5} />
      <line x1="162" y1="85" x2="165" y2="50" stroke={micColor} strokeWidth={1.5} />
      <line x1="174" y1="85" x2="170" y2="55" stroke={micColor} strokeWidth={1.5} />
      <line x1="182" y1="85" x2="175" y2="60" stroke={micColor} strokeWidth={1.5} />
      {/* Cross diagonals other direction */}
      <line x1="140" y1="60" x2="160" y2="85" stroke={micColor} strokeWidth={1.5} />
      <line x1="148" y1="52" x2="172" y2="85" stroke={micColor} strokeWidth={1.5} />
      <line x1="160" y1="50" x2="180" y2="78" stroke={micColor} strokeWidth={1.5} />
      <line x1="172" y1="55" x2="184" y2="78" stroke={micColor} strokeWidth={1.5} />

      {/* Mic body left and right sides */}
      <line x1="130" y1="85" x2="130" y2="175" stroke={micColor} strokeWidth={sw} strokeLinecap="round" />
      <line x1="190" y1="85" x2="190" y2="175" stroke={micColor} strokeWidth={sw} strokeLinecap="round" />

      {/* Mic body vertical slats (behind heart) */}
      <line x1="145" y1="100" x2="145" y2="175" stroke={micColor} strokeWidth={2.5} strokeLinecap="round" />
      <line x1="160" y1="100" x2="160" y2="175" stroke={micColor} strokeWidth={2.5} strokeLinecap="round" />
      <line x1="175" y1="100" x2="175" y2="175" stroke={micColor} strokeWidth={2.5} strokeLinecap="round" />

      {/* Mic body bottom curve */}
      <path
        d="M 130 175 Q 160 205 190 175"
        stroke={micColor}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />

      {/* Mic bottom ring */}
      <path
        d="M 140 195 Q 160 208 180 195"
        stroke={micColor}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />

      {/* Mic stand */}
      <line x1="160" y1="200" x2="160" y2="245" stroke={micColor} strokeWidth={sw} strokeLinecap="round" />
      <line x1="145" y1="245" x2="175" y2="245" stroke={micColor} strokeWidth={sw} strokeLinecap="round" />

      {/* Heart - centered on mic, red, crossing over body */}
      <path
        d="
          M 160 115
          C 148 100, 128 102, 128 122
          C 128 140, 148 158, 160 172
          C 172 158, 192 140, 192 122
          C 192 102, 172 100, 160 115
          Z
        "
        stroke={heartColor}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default Logo
