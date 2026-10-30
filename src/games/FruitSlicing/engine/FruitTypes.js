/**
 * Fruit Types configuration and definitions
 */

export const FRUIT_TYPES = {
  WATERMELON: {
    id: 'WATERMELON',
    name: 'Watermelon',
    radius: 46,
    points: 1,
    weight: 24, // Spawn weight
    splatColor: 'rgba(239, 68, 68, 0.75)',
    juiceColors: ['#ef4444', '#dc2626', '#f87171', '#15803d'],
    fleshColor: '#ef4444',
    rindColor: '#16a34a',
    innerRindColor: '#dcfce7',
    seedColor: '#1e293b'
  },
  ORANGE: {
    id: 'ORANGE',
    name: 'Orange',
    radius: 38,
    points: 1,
    weight: 22,
    splatColor: 'rgba(249, 115, 22, 0.75)',
    juiceColors: ['#f97316', '#fb923c', '#fdba74', '#ea580c'],
    fleshColor: '#f97316',
    rindColor: '#ea580c',
    innerRindColor: '#ffedd5',
    segmentColor: '#fb923c'
  },
  STRAWBERRY: {
    id: 'STRAWBERRY',
    name: 'Strawberry',
    radius: 32,
    points: 2,
    weight: 18,
    splatColor: 'rgba(225, 29, 72, 0.75)',
    juiceColors: ['#e11d48', '#f43f5e', '#fda4af', '#991b1b'],
    fleshColor: '#e11d48',
    rindColor: '#be123c',
    seedColor: '#fde047',
    leafColor: '#15803d'
  },
  BANANA: {
    id: 'BANANA',
    name: 'Banana',
    radius: 36,
    points: 2,
    weight: 16,
    splatColor: 'rgba(234, 179, 8, 0.75)',
    juiceColors: ['#eab308', '#facc15', '#fef08a', '#ca8a04'],
    fleshColor: '#fef08a',
    rindColor: '#eab308',
    tipColor: '#854d0e'
  },
  APPLE: {
    id: 'APPLE',
    name: 'Apple',
    radius: 36,
    points: 1,
    weight: 20,
    splatColor: 'rgba(220, 38, 38, 0.75)',
    juiceColors: ['#dc2626', '#ef4444', '#fecaca', '#991b1b'],
    fleshColor: '#fef3c7',
    rindColor: '#b91c1c',
    stemColor: '#78350f',
    leafColor: '#22c55e'
  },
  PINEAPPLE: {
    id: 'PINEAPPLE',
    name: 'Pineapple',
    radius: 44,
    points: 3,
    weight: 12,
    splatColor: 'rgba(234, 179, 8, 0.75)',
    juiceColors: ['#eab308', '#ca8a04', '#15803d', '#fef08a'],
    fleshColor: '#fde047',
    rindColor: '#854d0e',
    crownColor: '#16a34a'
  },
  COCONUT: {
    id: 'COCONUT',
    name: 'Coconut',
    radius: 40,
    points: 3,
    weight: 10,
    splatColor: 'rgba(248, 250, 252, 0.8)',
    juiceColors: ['#f8fafc', '#e2e8f0', '#78350f', '#cbd5e1'],
    fleshColor: '#f8fafc',
    rindColor: '#78350f',
    huskColor: '#451a03'
  },
  DRAGONFRUIT: {
    id: 'DRAGONFRUIT',
    name: 'Dragon Fruit',
    radius: 42,
    points: 5,
    weight: 6, // Rare golden bonus fruit
    splatColor: 'rgba(236, 72, 153, 0.85)',
    juiceColors: ['#ec4899', '#f472b6', '#fdf2f8', '#22c55e'],
    fleshColor: '#fdf2f8',
    rindColor: '#db2777',
    spikeColor: '#22c55e',
    seedColor: '#0f172a'
  },
  BOMB: {
    id: 'BOMB',
    name: 'Bomb',
    radius: 34,
    points: -20,
    weight: 14,
    isBomb: true,
    splatColor: 'rgba(239, 68, 68, 0.9)',
    fuseSparkColors: ['#fbbf24', '#f97316', '#ef4444', '#ffffff']
  }
};

/**
 * Randomly pick a fruit type based on spawn weights.
 * @param {boolean} includeBomb - whether bombs can be spawned
 */
export const getRandomFruitType = (includeBomb = true) => {
  const keys = Object.keys(FRUIT_TYPES).filter(k => includeBomb || k !== 'BOMB');
  const totalWeight = keys.reduce((sum, key) => sum + FRUIT_TYPES[key].weight, 0);
  let rand = Math.random() * totalWeight;

  for (const key of keys) {
    if (rand < FRUIT_TYPES[key].weight) {
      return FRUIT_TYPES[key];
    }
    rand -= FRUIT_TYPES[key].weight;
  }
  return FRUIT_TYPES.WATERMELON;
};
