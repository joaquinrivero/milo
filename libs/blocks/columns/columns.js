export default function init(el) {
  const rows = el.querySelectorAll(':scope > div');
  rows.forEach((row, rdx) => {
    row.className = `row row-${rdx + 1}`;
    const cols = row.querySelectorAll(':scope > div');
    cols.forEach((col, cdx) => {
      col.className = `col col-${cdx + 1}`;
      col.querySelectorAll('ul')?.forEach((ul) => {
        ul?.querySelectorAll('li')?.forEach((li) => {
          const picture = li?.querySelector('picture');
          picture.querySelector('img').setAttribute('width', '24');
          picture.querySelector('img').setAttribute('height', '24');
          picture.querySelector('img').setAttribute('alt', '');
        });
      });
    });
  });
  if (el.classList.contains('table')) {
    el.classList.add('columns-table');
    el.classList.remove('table');
  }
}
