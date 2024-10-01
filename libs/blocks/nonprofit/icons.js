const nonprofitIcons = {
  CHEVRON_DOWN:
    '<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.64477 6.53455L11.3367 1.84314C11.6931 1.48767 11.6931 0.910519 11.3367 0.554079C10.9807 0.198119 10.4036 0.198119 10.0476 0.554079L6.00025 4.60102L1.95289 0.554079C1.59693 0.198119 1.01978 0.198119 0.663827 0.554079C0.485607 0.732299 0.396736 0.965209 0.396736 1.19861C0.396736 1.43201 0.486097 1.66541 0.663827 1.84314L5.35572 6.53455C5.5337 6.71277 5.76697 6.80164 6.00025 6.80152C6.23353 6.80164 6.46679 6.71277 6.64477 6.53455Z" fill="#222222"/></svg>',
  CHEVRON_RIGHT:
    '<svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L1 9" stroke="#CACACA" stroke-width="1.5" stroke-linecap="round"/></svg>',
  BACK: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="#1D1B20"/></svg>',
  CLOSE:
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6552 10.0637L7.59174 6.00024L11.6552 1.93674C11.8663 1.72569 11.9848 1.43945 11.9848 1.14099C11.9848 0.842521 11.8663 0.556282 11.6552 0.345235C11.4442 0.134189 11.1579 0.015625 10.8595 0.015625C10.561 0.015625 10.2748 0.134189 10.0637 0.345235L6.00024 4.40874L1.93674 0.345235C1.72569 0.134189 1.43945 0.015625 1.14099 0.015625C0.842521 0.015625 0.556281 0.134189 0.345235 0.345235C0.134189 0.556281 0.015625 0.842521 0.015625 1.14099C0.015625 1.43945 0.134189 1.72569 0.345235 1.93674L4.40874 6.00024L0.345235 10.0637C0.134189 10.2748 0.015625 10.561 0.015625 10.8595C0.015625 11.1579 0.134189 11.4442 0.345235 11.6552C0.556282 11.8663 0.842521 11.9848 1.14099 11.9848C1.43945 11.9848 1.72569 11.8663 1.93674 11.6552L6.00024 7.59174L10.0637 11.6552C10.1682 11.7597 10.2923 11.8426 10.4288 11.8992C10.5654 11.9557 10.7117 11.9848 10.8595 11.9848C11.0073 11.9848 11.1536 11.9557 11.2901 11.8992C11.4267 11.8426 11.5507 11.7597 11.6552 11.6552C11.7597 11.5507 11.8426 11.4267 11.8992 11.2901C11.9557 11.1536 11.9848 11.0073 11.9848 10.8595C11.9848 10.7117 11.9557 10.5654 11.8992 10.4288C11.8426 10.2923 11.7597 10.1682 11.6552 10.0637Z" fill="#707070"/></svg>',
  UPLOAD:
    '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 386.883"><path fill-rule="nonzero" d="M377.763 115.7c-9.42 2.733-18.532 6.86-27.591 12.155-9.256 5.41-18.373 12.031-27.649 19.629l-19.849-22.742c16.721-15.527 33.187-26.464 49.108-33.514-13.06-22.39-31.538-38.532-52.418-48.549-21.339-10.238-45.242-14.171-68.507-11.922-23.123 2.234-45.56 10.619-64.123 25.025-21.451 16.646-37.775 41.521-44.034 74.469l-1.959 10.309-10.27 1.801c-27.993 4.909-49.283 18.793-62.859 36.776-7.186 9.518-12.228 20.161-14.969 31.19-2.728 10.979-3.193 22.399-1.243 33.525 3.291 18.766 13.592 36.737 31.669 50.382 5.467 4.128 11.376 7.709 17.886 10.48 6.215 2.647 13.017 4.612 20.558 5.686h78.258v30.246h-78.827l-1.891-.178c-11.099-1.413-20.982-4.186-29.914-7.99-8.994-3.829-16.989-8.65-24.264-14.142C20.256 299.753 6.183 275.02 1.628 249.05c-2.669-15.225-2.027-30.868 1.715-45.929 3.73-15.012 10.524-29.404 20.167-42.177 16.233-21.507 40.501-38.514 71.737-46.241 9.014-35.904 28.299-63.573 53.057-82.786C171.438 13.963 199.327 3.521 228.021.748c28.551-2.76 57.975 2.11 84.339 14.758 28.095 13.479 52.661 35.696 68.986 66.815 13.827-2.201 27.042-1.521 39.42 1.5 18.862 4.603 35.493 14.611 49.212 28.159 13.36 13.193 23.994 29.797 31.216 48.001 16.814 42.377 15.209 93.978-13.361 131.996-9.299 12.37-21.252 22.45-35.572 30.468-13.811 7.735-29.884 13.593-47.949 17.787l-3.368.414h-66.346V310.4h64.727c14.501-3.496 27.297-8.212 38.168-14.299 10.794-6.045 19.62-13.396 26.238-22.2 21.842-29.066 22.745-69.34 9.463-102.815-5.698-14.359-13.999-27.371-24.363-37.605-10.007-9.882-21.906-17.126-35.154-20.36-6.654-1.625-13.721-2.248-21.145-1.705l-14.769 4.284zM205.205 265.348c-5.288 6.391-14.756 7.285-21.148 1.997-6.391-5.288-7.285-14.757-1.997-21.148l59.645-72.019c5.288-6.392 14.757-7.285 21.148-1.998a15.053 15.053 0 012.707 2.921l60.072 72.279c5.287 6.359 4.42 15.802-1.939 21.09-6.359 5.287-15.801 4.42-21.089-1.939l-34.288-41.256.202 146.628c0 8.273-6.707 14.98-14.98 14.98-8.274 0-14.981-6.707-14.981-14.98l-.202-146.582-33.15 40.027z"/></svg>',
};

export const NONPRFIT_ICONS = Object.freeze({
  CHEVRON_DOWN: 'CHEVRON_DOWN',
  CHEVRON_RIGHT: 'CHEVRON_RIGHT',
  BACK: 'BACK',
  CLOSE: 'CLOSE',
  UPLOAD: 'UPLOAD',
});

export function getNonprofitIconTag(type) {
  const iconString = nonprofitIcons[type];
  const wrapper = document.createElement('div');
  wrapper.innerHTML = iconString;
  const icon = wrapper.querySelector('svg');
  icon.classList.add('np-icon');
  return icon;
}
