const FONT_MAP = {
  premium: [
    {
      headline: 'Playfair Display',
      headlineWeights: [600, 700],
      body: 'Inter',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500&display=swap"
    },
    {
      headline: 'Spectral',
      headlineWeights: [500, 600],
      body: 'Source Sans 3',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Spectral:wght@500;600&family=Source+Sans+3:wght@400;500&display=swap"
    }
  ],
  modern: [
    {
      headline: 'Inter',
      headlineWeights: [600, 700],
      body: 'Roboto Slab',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@600;700&family=Roboto+Slab:wght@400;500&display=swap"
    },
    {
      headline: 'Manrope',
      headlineWeights: [600, 700],
      body: 'Inter',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Manrope:wght@600;700&family=Inter:wght@400;500&display=swap"
    }
  ],
  playful: [
    {
      headline: 'Righteous',
      headlineWeights: [400],
      body: 'Nunito',
      bodyWeights: [400, 600],
      importUrl: "https://fonts.googleapis.com/css2?family=Righteous&family=Nunito:wght@400;600&display=swap"
    },
    {
      headline: 'Baloo 2',
      headlineWeights: [500],
      body: 'Mulish',
      bodyWeights: [400, 600],
      importUrl: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500&family=Mulish:wght@400;600&display=swap"
    }
  ],
  conservative: [
    {
      headline: 'EB Garamond',
      headlineWeights: [600, 700],
      body: 'Source Sans 3',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;700&family=Source+Sans+3:wght@400;500&display=swap"
    },
    {
      headline: 'Libre Baskerville',
      headlineWeights: [700],
      body: 'Work Sans',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Work+Sans:wght@400;500&display=swap"
    }
  ],
  techie: [
    {
      headline: 'Space Grotesk',
      headlineWeights: [500, 600],
      body: 'Inter',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500&display=swap"
    },
    {
      headline: 'Orbitron',
      headlineWeights: [500, 600],
      body: 'Inter',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600&family=Inter:wght@400;500&display=swap"
    }
  ],
  healthcare: [
    {
      headline: 'Poppins',
      headlineWeights: [500, 600],
      body: 'Source Sans 3',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&family=Source+Sans+3:wght@400;500&display=swap"
    },
    {
      headline: 'Nunito Sans',
      headlineWeights: [600],
      body: 'Source Sans 3',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600&family=Source+Sans+3:wght@400;500&display=swap"
    }
  ],
  legal: [
    {
      headline: 'Libre Baskerville',
      headlineWeights: [700],
      body: 'Work Sans',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Work+Sans:wght@400;500&display=swap"
    },
    {
      headline: 'Roboto Slab',
      headlineWeights: [600],
      body: 'Source Sans 3',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@600&family=Source+Sans+3:wght@400;500&display=swap"
    }
  ],
  finance: [
    {
      headline: 'Merriweather',
      headlineWeights: [600, 700],
      body: 'Inter',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@600;700&family=Inter:wght@400;500&display=swap"
    },
    {
      headline: 'IBM Plex Sans',
      headlineWeights: [600],
      body: 'IBM Plex Sans',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap"
    }
  ],
  hospitality: [
    {
      headline: 'Playfair Display',
      headlineWeights: [600],
      body: 'Source Sans 3',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Source+Sans+3:wght@400;500&display=swap"
    },
    {
      headline: 'Cormorant Garamond',
      headlineWeights: [500, 600],
      body: 'Work Sans',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Work+Sans:wght@400;500&display=swap"
    }
  ],
  education: [
    {
      headline: 'Domine',
      headlineWeights: [600],
      body: 'Source Sans 3',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Domine:wght@600&family=Source+Sans+3:wght@400;500&display=swap"
    },
    {
      headline: 'Lora',
      headlineWeights: [600],
      body: 'Open Sans',
      bodyWeights: [400, 600],
      importUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Open+Sans:wght@400;600&display=swap"
    }
  ],
  construction: [
    {
      headline: 'Montserrat',
      headlineWeights: [600, 700],
      body: 'Source Sans 3',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Source+Sans+3:wght@400;500&display=swap"
    },
    {
      headline: 'Oswald',
      headlineWeights: [500, 600],
      body: 'Roboto',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Roboto:wght@400;500&display=swap"
    }
  ],
  restaurant: [
    {
      headline: 'Cormorant Garamond',
      headlineWeights: [500, 600],
      body: 'Source Sans 3',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Source+Sans+3:wght@400;500&display=swap"
    },
    {
      headline: 'Abril Fatface',
      headlineWeights: [400],
      body: 'Work Sans',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Work+Sans:wght@400;500&display=swap"
    }
  ],
  fitness: [
    {
      headline: 'Oswald',
      headlineWeights: [500, 600],
      body: 'Inter',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Inter:wght@400;500&display=swap"
    },
    {
      headline: 'Montserrat',
      headlineWeights: [600, 700],
      body: 'Roboto',
      bodyWeights: [400, 500],
      importUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Roboto:wght@400;500&display=swap"
    }
  ]
};

const DEFAULT_PAIR = [
  {
    headline: 'Inter',
    headlineWeights: [600, 700],
    body: 'Source Sans 3',
    bodyWeights: [400, 500],
    importUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@600;700&family=Source+Sans+3:wght@400;500&display=swap"
  },
  {
    headline: 'Merriweather',
    headlineWeights: [600],
    body: 'Open Sans',
    bodyWeights: [400, 600],
    importUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@600&family=Open+Sans:wght@400;600&display=swap"
  }
];

export function getFontPairs(tone) {
  const normalized = tone?.toLowerCase() ?? '';
  return FONT_MAP[normalized] ?? DEFAULT_PAIR;
}

export const SYSTEM_FALLBACK = "'Inter', 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
