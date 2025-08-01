/*
 * tabs - consonant v6
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Tab_Role
 */
import { createTag, MILO_EVENTS, getConfig } from '../../../utils/utils.js';
import { processTrackingLabels } from '../../../martech/attributes.js';

const PADDLE = '<svg aria-hidden="true" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.50001 13.25C1.22022 13.25 0.939945 13.1431 0.726565 12.9292C0.299315 12.5019 0.299315 11.8096 0.726565 11.3823L5.10938 7L0.726565 2.61768C0.299315 2.19043 0.299315 1.49805 0.726565 1.0708C1.15333 0.643068 1.84669 0.643068 2.27345 1.0708L7.4297 6.22656C7.63478 6.43164 7.75001 6.70996 7.75001 7C7.75001 7.29004 7.63478 7.56836 7.4297 7.77344L2.27345 12.9292C2.06007 13.1431 1.7798 13.2495 1.50001 13.25Z" fill="currentColor"/></svg>';
const tabColor = {};
const linkedTabs = {};
const tabChangeEvent = new Event('milo:tab:changed');

const isTabInTabListView = (tab) => {
  const tabList = tab.closest('[role="tablist"], [role="radiogroup"]');
  const tabRect = tab.getBoundingClientRect();
  const tabListRect = tabList.getBoundingClientRect();

  const tabLeft = Math.round(tabRect.left);
  const tabRight = Math.round(tabRect.right);
  const tabListLeft = Math.round(tabListRect.left);
  const tabListRight = Math.round(tabListRect.right);

  return (tabLeft >= tabListLeft && tabRight <= tabListRight);
};

const scrollTabIntoView = (e, inline = 'center') => {
  const isElInView = isTabInTabListView(e);
  if (!isElInView) e.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline });
};

const setAttributes = (el, attrs) => {
  Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
};

const removeAttributes = (el, attrsKeys) => {
  attrsKeys.forEach((key) => el.removeAttribute(key));
};

const scrollStackedMobile = (content) => {
  if (!window.matchMedia('(max-width: 600px)').matches) return;
  const rects = content.getBoundingClientRect();
  const stickyTop = document.querySelector('.feds-localnav') ?? document.querySelector('.global-navigation, .gnav');
  const navHeight = stickyTop?.scrollHeight || 0;
  const topOffset = rects.top + window.scrollY - navHeight - 1;
  window.scrollTo({ top: topOffset, behavior: 'smooth' });
};

export function getRedirectionUrl(linkedTabsList, targetId) {
  if (!targetId || !linkedTabsList[targetId] || window.location.pathname === linkedTabsList[targetId]) return '';
  const currentUrl = new URL(window.location.href);
  /* c8 ignore next 4 */
  const tabParam = currentUrl.searchParams.get('tab');
  if (tabParam) {
    currentUrl.searchParams.set('tab', `${tabParam.split('-')[0]}-${targetId.split('-')[2]}`);
  }
  currentUrl.pathname = linkedTabsList[targetId];
  return currentUrl;
}

function changeTabs(e) {
  const { target } = e;
  const targetId = target.getAttribute('id');
  const redirectionUrl = getRedirectionUrl(linkedTabs, targetId);
  /* c8 ignore next 4 */
  if (redirectionUrl) {
    window.location.assign(redirectionUrl);
    return;
  }
  const parent = target.parentNode;
  const content = parent.parentNode.parentNode.lastElementChild;
  const tabsBlock = target.closest('.tabs');
  const blockId = tabsBlock.id;
  const isRadio = target.getAttribute('role') === 'radio';
  const attributeName = isRadio ? 'aria-checked' : 'aria-selected';

  let targetContent;
  if (isRadio) {
    targetContent = content.querySelector(`#${target.getAttribute('data-control-id')}`);
  } else {
    targetContent = content.querySelector(`#${target.getAttribute('aria-controls')}`);
  }

  parent
    .querySelectorAll(`[${attributeName}="true"][data-block-id="${blockId}"]`)
    .forEach((t) => {
      t.setAttribute(attributeName, false);
      if (Object.keys(tabColor).length) {
        t.removeAttribute('style', 'backgroundColor');
      }
    });
  target.setAttribute(attributeName, true);
  if (tabColor[targetId]) {
    target.style.backgroundColor = tabColor[targetId];
  }
  scrollTabIntoView(target);
  content
    .querySelectorAll(`.tabpanel[data-block-id="${blockId}"]`)
    .forEach((p) => p.setAttribute('hidden', true));
  targetContent?.removeAttribute('hidden');
  if (tabsBlock.classList.contains('stacked-mobile')) scrollStackedMobile(targetContent);
  window.dispatchEvent(tabChangeEvent);
}

function getStringKeyName(str) {
  // The \p{L} and \p{N} Unicode props are used to match any letter or digit character in any lang.
  const regex = /[^\p{L}\p{N}_-]/gu;
  return str.trim().toLowerCase().replace(/\s+/g, '-').replace(regex, '');
}

function getUniqueId(el, rootElem) {
  const tabs = rootElem.querySelectorAll('.tabs');
  return [...tabs].indexOf(el) + 1;
}

function configTabs(config, rootElem) {
  if (config['active-tab']) {
    const id = `#tab-${CSS.escape(config['tab-id'])}-${CSS.escape(getStringKeyName(config['active-tab']))}`;
    const sel = rootElem.querySelector(id);
    if (sel) {
      sel.addEventListener('click', (e) => e.stopPropagation(), { once: true });
      sel.click();
    }
  }

  const params = new URLSearchParams(window.location.search);
  // Deeplink with a custom id parameter, e.g. ?plans=edu
  const deeplinkParam = params.get(config.id);
  if (deeplinkParam) {
    const tabBtn = rootElem.querySelector(`[data-deeplink="${deeplinkParam}"]`);
    if (tabBtn) {
      tabBtn.click();
      return;
    }
  }
  // Deeplink with tab parameter, e.g. ?tab=plans-2
  const tabParam = params.get('tab');
  if (!tabParam) return;
  const dashIndex = tabParam.lastIndexOf('-');
  const [tabsId, tabIndex] = [tabParam.substring(0, dashIndex), tabParam.substring(dashIndex + 1)];
  if (tabsId === config.id) rootElem.querySelector(`#tab-${config.id}-${tabIndex}`)?.click();
}

function initTabs(elm, config, rootElem) {
  const tabs = elm.querySelectorAll('[role="tab"], [role="radio"]');
  const tabLists = elm.querySelectorAll('[role="tablist"], [role="radiogroup"]');
  let tabFocus = 0;

  tabLists.forEach((tabList) => {
    tabList.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.key === 'ArrowRight') {
          tabFocus += 1;
          /* c8 ignore next */
          if (tabFocus >= tabs.length) tabFocus = 0;
        } else if (e.key === 'ArrowLeft') {
          tabFocus -= 1;
          /* c8 ignore next */
          if (tabFocus < 0) tabFocus = tabs.length - 1;
        }
        tabs[tabFocus].setAttribute('tabindex', 0);
        tabs[tabFocus].focus();
      }
    });
  });
  tabs.forEach((tab) => {
    tab.addEventListener('click', changeTabs);
  });
  if (config) configTabs(config, rootElem);
}

function previousTab(current, i, arr) {
  const next = arr[i + 1];
  // The tab before the first visible tab
  return (next && !isTabInTabListView(current) && isTabInTabListView(next));
}

function nextTab(current, i, arr) {
  const previous = arr[i - 1];
  // The tab after the last visible tab
  return (previous && isTabInTabListView(previous) && !isTabInTabListView(current));
}

function initPaddles(tabList, left, right, isRadio) {
  const tabListItems = tabList.querySelectorAll(isRadio ? '[role="radio"]' : '[role="tab"]');
  const tabListItemsArray = [...tabListItems];
  const firstTab = tabListItemsArray[0];
  const lastTab = tabListItemsArray[tabListItemsArray.length - 1];

  left.addEventListener('click', () => {
    const previous = tabListItemsArray.find(previousTab);
    if (previous) {
      scrollTabIntoView(previous, 'end');
    } else {
      /* c8 ignore next 3 */
      const { width } = tabList.getBoundingClientRect();
      tabList.scrollBy({ left: -(width / 2), behavior: 'smooth' });
    }
  });
  right.addEventListener('click', () => {
    const next = tabListItemsArray.find(nextTab);
    if (next) {
      scrollTabIntoView(next, 'start');
    } else {
      /* c8 ignore next 3 */
      const { width } = tabList.getBoundingClientRect();
      tabList.scrollBy({ left: width / 2, behavior: 'smooth' });
    }
  });

  const options = {
    root: tabList,
    rootMargin: '0px',
    threshold: 0.9,
  };

  const callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === firstTab) {
        if (entry.isIntersecting) {
          setAttributes(left, { disabled: '', 'aria-hidden': true });
        } else {
          removeAttributes(left, ['disabled', 'aria-hidden']);
        }
      } else if (entry.target === lastTab) {
        if (entry.isIntersecting) {
          setAttributes(right, { disabled: '', 'aria-hidden': true });
        } else {
          removeAttributes(right, ['disabled', 'aria-hidden']);
        }
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  observer.observe(firstTab);
  observer.observe(lastTab);
}

const handleDeferredImages = (block) => {
  /* c8 ignore next 6 */
  const loadLazyImages = () => {
    const images = block.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.removeAttribute('loading');
    });
  };
  document.addEventListener(MILO_EVENTS.DEFERRED, loadLazyImages, { once: true, capture: true });
};

const handlePillSize = (pill) => {
  const sizes = ['s', 'm', 'l'];
  const variant = pill.substring(0, pill.indexOf('-pill'));
  const size = sizes.findIndex((tshirt) => variant.startsWith(tshirt));
  return `${sizes[size]?.[0] ?? sizes[1]}-pill`;
};

export function assignLinkedTabs(linkedTabsList, metaSettings, id, val) {
  if (!metaSettings.link || !id || !val || !linkedTabsList) return;
  const relativeLinkRegex = /^\/(?:[a-zA-Z0-9-_]+(?:\/[a-zA-Z0-9-_]+)*)?$/;
  if (relativeLinkRegex.test(metaSettings.link)) {
    linkedTabsList[`tab-${id}-${val}`] = metaSettings.link;
  }
}

const init = (block) => {
  const rootElem = block.closest('.fragment') || document;
  const rows = block.querySelectorAll(':scope > div');
  const parentSection = block.closest('.section');
  /* c8 ignore next */
  if (!rows.length) return;

  // Tab Config
  const config = {};
  const configRows = [...rows];
  configRows.splice(0, 1);
  configRows.forEach((row) => {
    const rowKey = getStringKeyName(row.children[0].textContent);
    const rowVal = row.children[1].textContent.trim();
    config[rowKey] = rowVal;
    row.remove();
  });
  const tabId = config.id || getUniqueId(block, rootElem);
  config['tab-id'] = tabId;
  block.id = `tabs-${tabId}`;
  parentSection?.classList.add(`tablist-${tabId}-section`);

  // Tab Content
  const tabContentContainer = createTag('div', { class: 'tab-content-container' });
  const tabContent = createTag('div', { class: 'tab-content' }, tabContentContainer);
  block.append(tabContent);

  const isRadio = block.classList.contains('radio');
  // Tab List
  const tabList = rows[0];
  tabList.classList.add('tabList');
  tabList.setAttribute('role', isRadio ? 'radiogroup' : 'tablist');
  const tabListContainer = tabList.querySelector(':scope > div');
  tabListContainer.classList.add('tab-list-container');
  const tabListLabel = config.pretext;
  if (tabListLabel) tabList.setAttribute('aria-label', tabListLabel);

  const tabListItems = rows[0].querySelectorAll(':scope li');
  if (tabListItems) {
    const pillVariant = [...block.classList].find((variant) => variant.includes('pill'));
    const btnClass = pillVariant ? handlePillSize(pillVariant) : 'heading-xxs'; /* Mweb specific; xxs was xs */
    tabListItems.forEach((item, i) => {
      const tabName = config.id ? i + 1 : getStringKeyName(item.textContent);
      const controlId = `tab-panel-${tabId}-${tabName}`;
      const tabBtnAttributes = {
        role: isRadio ? 'radio' : 'tab',
        class: btnClass,
        id: `tab-${tabId}-${tabName}`,
        tabindex: '0',
        [isRadio ? 'aria-checked' : 'aria-selected']: (i === 0) ? 'true' : 'false',
        'data-block-id': `tabs-${tabId}`,
        'daa-state': 'true',
        'daa-ll': `tab-${tabId}-${tabName}`,
        ...(isRadio ? { 'data-control-id': controlId } : { 'aria-controls': controlId }),
      };
      const tabBtn = createTag('button', tabBtnAttributes);
      tabBtn.innerText = item.textContent;
      tabListContainer.append(tabBtn);

      const tabContentAttributes = {
        id: `tab-panel-${tabId}-${tabName}`,
        ...(isRadio ? { } : { role: 'tabpanel' }),
        class: 'tabpanel',
        'aria-labelledby': `tab-${tabId}-${tabName}`,
        'data-block-id': `tabs-${tabId}`,
      };
      const tabListContent = createTag('div', tabContentAttributes);
      tabListContent.setAttribute('aria-labelledby', `tab-${tabId}-${tabName}`);
      if (i > 0) tabListContent.setAttribute('hidden', '');
      tabContentContainer.append(tabListContent);
    });
    tabListItems[0].parentElement.remove();
    tabListContainer.dataset.pretext = config.pretext;
  }

  // Tab Paddles
  const paddleLeft = createTag('button', { class: 'paddle paddle-left', disabled: '', 'aria-hidden': true, 'aria-label': 'Scroll tabs to left' }, PADDLE);
  const paddleRight = createTag('button', { class: 'paddle paddle-right', disabled: '', 'aria-hidden': true, 'aria-label': 'Scroll tabs to right' }, PADDLE);
  tabList.insertAdjacentElement('afterend', paddleRight);
  block.prepend(paddleLeft);
  initPaddles(tabList, paddleLeft, paddleRight, isRadio);

  // Tab Sections
  const allSections = Array.from(rootElem.querySelectorAll('div.section'));
  allSections.forEach((e) => {
    const sectionMetadata = e.querySelector(':scope > .section-metadata');
    if (!sectionMetadata) return;
    const metaSettings = {};
    sectionMetadata.querySelectorAll(':scope > div').forEach((row) => {
      const key = getStringKeyName(row.children[0].textContent);
      if (!['tab', 'tab-background', 'link', 'deeplink'].includes(key)) return;
      const val = row.children[1].textContent;
      if (!val) return;
      metaSettings[key] = val;
    });
    if (!metaSettings.tab) return;
    let id = tabId;
    let val = getStringKeyName(metaSettings.tab);
    const assotiatedTabButton = rootElem.querySelector(`#tab-${val}`);
    assotiatedTabButton?.setAttribute('data-deeplink', metaSettings.deeplink);
    let assocTabItem = rootElem.querySelector(`#tab-panel-${id}-${val}`);
    if (config.id) {
      const values = metaSettings.tab.split(',');
      [id] = values;
      val = getStringKeyName(String(values[1]));
      assocTabItem = rootElem.querySelector(`#tab-panel-${id}-${val}`);
    }
    if (assocTabItem) {
      if (metaSettings['tab-background']) {
        tabColor[`tab-${id}-${val}`] = metaSettings['tab-background'];
      }
      assignLinkedTabs(linkedTabs, metaSettings, id, val);
      const tabLabel = tabListItems[val - 1]?.innerText;
      if (tabLabel) {
        assocTabItem.setAttribute('data-nested-lh', `t${val}${processTrackingLabels(tabLabel, getConfig(), 3)}`);
      }
      const section = sectionMetadata.closest('.section');
      assocTabItem.append(section);
    }
  });
  handleDeferredImages(block);
  initTabs(block, config, rootElem);
};

export default init;
