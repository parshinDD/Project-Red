const svgUrl = (body) =>
    `url("data:image/svg+xml,${encodeURIComponent(body)}")`;

export const HAZE = svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900">
    <filter id="f" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.0026 0.0075" numOctaves="3" seed="23" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 0.55  0 0 0 0 0.6  0 0 0 1.35 -0.5"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#f)"/>
  </svg>`,
);

export const HAZE_FRONT = svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700">
    <filter id="h" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.007 0.02" numOctaves="3" seed="61" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 0.6  0 0 0 0 0.64  0 0 0 1.5 -0.7"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#h)"/>
  </svg>`,
);

export const WALL_BASE = svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000">
    <filter id="p" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.026 0.022" numOctaves="5" seed="9" result="n"/>
      <feDiffuseLighting in="n" surfaceScale="2.4" diffuseConstant="1.05" lighting-color="#9a6a70">
        <feDistantLight azimuth="235" elevation="50"/>
      </feDiffuseLighting>
    </filter>
    <rect width="100%" height="100%" filter="url(#p)"/>
  </svg>`,
);

export const WALL_STAINS = svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
    <defs>
      <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#150a06" stop-opacity="0.7"/>
        <stop offset="0.55" stop-color="#150a06" stop-opacity="0.32"/>
        <stop offset="1" stop-color="#150a06" stop-opacity="0"/>
      </linearGradient>
      <filter id="rough" x="-30%" y="-5%" width="160%" height="110%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.022 0.0045" numOctaves="3" seed="4" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="46" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feGaussianBlur in="d" stdDeviation="2.2 0.8"/>
      </filter>
      <filter id="blot" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.0042 0.0065" numOctaves="4" seed="12" result="t"/>
        <feColorMatrix in="t" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0 0.04  0 0 0 6.5 -3.85" result="m"/>
        <feGaussianBlur in="m" stdDeviation="5"/>
      </filter>
    </defs>
    <g filter="url(#rough)" fill="url(#s)">
      <rect x="120" y="-30" width="30" height="560"/>
      <rect x="168" y="-30" width="12" height="300"/>
      <rect x="430" y="-30" width="22" height="380"/>
      <rect x="1110" y="-30" width="26" height="470"/>
      <rect x="1345" y="-30" width="34" height="620"/>
      <rect x="1392" y="-30" width="12" height="260"/>
      <rect x="1500" y="-30" width="20" height="340"/>
      <rect x="40" y="-30" width="16" height="230"/>
    </g>
    <rect width="1600" height="1000" filter="url(#blot)" opacity="0.8"/>
  </svg>`,
);

export const WOOD = svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="360">
    <filter id="w" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.004 0.16" numOctaves="4" seed="2" stitchTiles="stitch"/>
      <feColorMatrix values="0.46 0 0 0 0.08  0.26 0 0 0 0.04  0.14 0 0 0 0.02  0 0 0 0 1"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#w)"/>
  </svg>`,
);

export const GRAIN = svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <filter id="g" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 -0.35"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#g)"/>
  </svg>`,
);
