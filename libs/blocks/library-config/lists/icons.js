import { fetchIconList } from '../../../features/icons/icons.js';
import { createTag } from '../../../utils/utils.js';
import createCopy from '../library-utils.js';

let fedIconList;
const iconElements = new Map();

export default async function iconList(content, list, query) {
  if (!fedIconList) {
    fedIconList = await fetchIconList(content[0].path);
    if (!fedIconList?.length) throw new Error('No icons returned from fetchIconList');
    fedIconList.forEach((icon) => {
      const svg = createTag('span', { class: `icon icon-${icon.name}` }, createTag('img', { class: `icon-${icon.name}-img icon-fed`, src: `${icon.url}`, width: '18px' }));
      const titleText = createTag('p', { class: 'item-title' }, icon.name);
      const title = createTag('li', { class: 'icon-item' }, svg);
      title.append(titleText);
      const copy = createTag('button', { class: 'copy' });
      copy.id = `${icon.name}-icon-copy`;
      copy.addEventListener('click', (e) => {
        e.target.classList.add('copied');
        setTimeout(() => { e.target.classList.remove('copied'); }, 3000);
        const formatted = `:${icon.name}:`;
        const blob = new Blob([formatted], { type: 'text/plain' });
        createCopy(blob);
        window.hlx?.rum.sampleRUM('click', { source: e.target });
      });
      title.append(copy);

      iconElements.set(icon.name, title);
    });
  }

  list.replaceChildren();

  iconElements.forEach((element, name) => {
    element.classList.toggle('is-hidden', query && !name.includes(query));
    list.appendChild(element);
  });
}
