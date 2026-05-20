export const palette = {
  ink: '#08080B',
  inkSoft: '#101015',
  ash: '#16171D',
  smoke: '#1F2027',
  iron: '#2A2B33',
  charcoal: '#373842',
  bone: '#ECE8DE',
  parchment: '#BCB6A8',
  haze: '#8A857B',
  muted: '#6C6760',
  faint: '#3D3A35',
  ember: '#D9263F',
  emberSoft: '#E84A60',
  emberDeep: '#7A0F1F',
  amber: '#E6A93B',
  amberSoft: '#F5C25A',
  amberDeep: '#6B4310',
  jade: '#22A06B',
  jadeSoft: '#3FC68A',
  azure: '#2A6BD0',
  violet: '#6A3DBF',
  meadow: '#2A6C2C',
};

export type GradientStops = [string, string];

export const gradientReeds: Record<string, GradientStops> = {
  emberFlare:    ['#B5223A', '#3F0A14'],
  oxbloodSilk:   ['#9A1F30', '#330610'],
  rubyAsh:       ['#A1283D', '#360812'],
  amberCrown:    ['#8E6516', '#2C1D06'],
  pyriteDusk:    ['#6F5212', '#241906'],
  jadeMoss:      ['#1F7A52', '#0B2419'],
  cinderGreen:   ['#306A24', '#0D1E08'],
  azureLore:     ['#205AB0', '#0A1F44'],
  twilightDune:  ['#4F3478', '#160E2A'],
  violetMyth:    ['#5C3194', '#1A0D32'],
};

export const gradientByIndex: GradientStops[] = [
  gradientReeds.emberFlare,
  gradientReeds.jadeMoss,
  gradientReeds.amberCrown,
  gradientReeds.oxbloodSilk,
  gradientReeds.azureLore,
  gradientReeds.violetMyth,
  gradientReeds.cinderGreen,
  gradientReeds.twilightDune,
  gradientReeds.pyriteDusk,
  gradientReeds.rubyAsh,
];

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const gap = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const spacing = {
  screenH: 20,
  sectionGap: 18,
};
