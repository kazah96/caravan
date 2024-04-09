export const ownTrackers = ['alivebe', 'alivebe-activity'];
export const mapConfig = {
  apikey: '3O9-ylCvwN9bJzvgjF5AVt-JuRAK0Kl0dBwNDRZelio',
  interactive: 1,
};

export const paceMeasures = {
  MPS: 'mps',
  KMPH: 'kmph',
  MPKM: 'mpkm',
};
export const measureMap = {
  [paceMeasures.MPS]: 'м/с',
  [paceMeasures.KMPH]: 'км/ч',
  [paceMeasures.MPKM]: 'мин/км',
};
export const paceName = {
  [paceMeasures.MPS]: { upper: 'Скорость', lower: 'Средняя скорость' },
  [paceMeasures.KMPH]: { upper: 'Скорость', lower: 'Средняя скорость' },
  [paceMeasures.MPKM]: { upper: 'Темп', lower: 'Средний темп' },
};
export const startSvg = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <circle cx="8" cy="8" r="7.5" fill="#2CC569" stroke="white" />
  </svg>`;
export const finishSvg = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <mask
      id="mask0_1_2152"
      style="mask-type:alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="16"
      height="16"
    >
      <path
        d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
        fill="#2CC569"
      />
    </mask>
    <g mask="url(#mask0_1_2152)">
      <rect x="3.2002" width="3.2" height="3.2" fill="#212121" />
      <rect x="6.40039" width="3.2" height="3.2" fill="white" />
      <rect x="12.7998" width="3.2" height="3.2" fill="white" />
      <rect width="3.2" height="3.2" fill="white" />
      <rect x="9.59961" width="3.2" height="3.2" fill="#212121" />
      <rect x="6.40039" y="9.59961" width="3.2" height="3.2" fill="white" />
      <rect x="3.2002" y="6.40039" width="3.2" height="3.2" fill="#212121" />
      <rect x="3.2002" y="12.8" width="3.2" height="3.2" fill="#212121" />
      <rect x="6.40039" y="6.40039" width="3.2" height="3.2" fill="white" />
      <rect x="6.40039" y="12.8" width="3.2" height="3.2" fill="white" />
      <rect x="12.7998" y="6.40039" width="3.2" height="3.2" fill="white" />
      <rect x="12.7998" y="12.8" width="3.2" height="3.2" fill="white" />
      <rect y="6.40039" width="3.2" height="3.2" fill="white" />
      <rect y="12.8" width="3.2" height="3.2" fill="white" />
      <rect x="9.59961" y="6.40039" width="3.2" height="3.2" fill="#212121" />
      <rect x="9.59961" y="12.8" width="3.2" height="3.2" fill="#212121" />
      <rect x="6.40039" y="3.19995" width="3.2" height="3.2" fill="#212121" />
      <rect x="12.7998" y="3.19995" width="3.2" height="3.2" fill="#212121" />
      <rect y="3.19995" width="3.2" height="3.2" fill="#212121" />
      <rect x="9.59961" y="3.19995" width="3.2" height="3.2" fill="white" />
      <rect x="3.2002" y="3.19995" width="3.2" height="3.2" fill="white" />
      <rect x="6.40039" y="9.59961" width="3.2" height="3.2" fill="#212121" />
      <rect x="12.7998" y="9.59961" width="3.2" height="3.2" fill="#212121" />
      <rect y="9.59961" width="3.2" height="3.2" fill="#212121" />
      <rect x="9.59961" y="9.59961" width="3.2" height="3.2" fill="white" />
      <rect x="3.2002" y="9.59961" width="3.2" height="3.2" fill="white" />
    </g>
  </svg>`;

export const DEFAULT_SEGMENT_DIVIDERS = [
  { id: 'disabled', value: 'Выкл' },
  { id: '0.5km', value: '0.5 км', distance: 500 },
  { id: '1km', value: '1 км', distance: 1000 },
  { id: '2km', value: '2 км', distance: 2000 },
  { id: '3km', value: '3 км', distance: 3000 },
  { id: '5km', value: '5 км', distance: 5000 },
  { id: '10km', value: '10 км', distance: 10000 },
  { id: '20km', value: '20 км', distance: 20000 },
  { id: '30km', value: '30 км', distance: 30000 },
  { id: '50km', value: '50 км', distance: 50000 },
  { id: '100km', value: '100 км', distance: 100000 },
  { id: '200km', value: '200 км', distance: 200000 },
];

export const valuesOptions = [
  {
    id: 'altitude',
    value: 'Высота',
    isChecked: true,
    color: '#7a7a7a',
    unit: 'м',
  },
];
export const offsetMap = {
  altitude: {
    top: 20,
    bottom: 5,
  },
  pace: {
    [paceMeasures.MPKM]: {
      top: 1,
      bottom: 5,
    },
    [paceMeasures.KMPH]: {
      top: 10,
      bottom: 50,
    },
    [paceMeasures.MPS]: {
      top: 10,
      bottom: 50,
    },
  },
};
