const VOLUME_COOKIE_REGEXP = /volume=([\d\.]+)/;
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlParamsObj = Array.from(urlParams).reduce((acc, [key, value])=>{
    if(!(key in acc)) {
      acc[key] = value;
      return acc;
    }
    if(!Array.isArray(acc[key])) {
      acc[key] = [acc[key], value];
      return acc;
    }
    acc[key].push(value);
    return acc;
  },{})

  const newFormData = {...settingFormData};
  Object.entries(urlParamsObj).forEach(([key, value]) => {
    if(value !== newFormData[key])  newFormData[key] = value;
  });
  const isInit = true;
  changeSetting(newFormData, isInit);
});

function handleSettingFormChange(formElement) {
  const fd = new FormData(formElement);
  const keys = fd.keys();
  const newFormData = {};
  for(let key of keys) {
    const value = fd.getAll(key);
    if(value.length===1) newFormData[key] = value[0];
    if(value.length>1)   newFormData[key] = value;
  }
  
  changeSetting(newFormData);
}
function isSame(a, b) {
  const getValue = (v)=>{
    if(Array.isArray(v)) return [...v].sort().join(',');
    return v;
  }
  const va = getValue(a);
  const vb = getValue(b);
  return va===vb;
}
function changeSetting(newFormData, init) {
  // adjust number
  newFormData.volume = Number(newFormData.volume);

  // sync form
  if(init || !isSame(newFormData.language, settingFormData.language)) changeLanguage(newFormData.language);
  if(init || !isSame(newFormData['vowels-locale'], settingFormData['vowels-locale'])) changeVowelsLocale(newFormData['vowels-locale']);
  if(init || !isSame(newFormData.volume, settingFormData.volume)) changeVolume(newFormData.volume);
  if(newFormData['auto-play'] !== settingFormData['auto-play']) changeAutoPlay(newFormData['auto-play']);
  settingFormData = newFormData;
  
  // sync url
  const urlParams = new URLSearchParams();
  Object.entries(newFormData).forEach(([key, value]) => {
    if(!isSame(value, DEFAULT_SETTING_FORM_DATA[key]) && value !== 'undefined' && key !== 'auto-play')  {
      if(Array.isArray(value)) {
        for(let vElement of value) urlParams.append(key, vElement);
        return;
      }
      urlParams.append(key, value);
    }
  });
  if(Array.from(urlParams).length === 0) {
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }
  window.history.replaceState({}, document.title, `${window.location.pathname}?${urlParams.toString()}`);
}

function changeLanguage(language) {
  document.documentElement.lang =  language;
  const languageStyleElement = document.getElementById('translation-style');
  const styleSheet = `
  .t-list>:not(.t-list__${language}) {
    display: none;
  }
  `;
  languageStyleElement.innerHTML = styleSheet;
  document.querySelectorAll(`[name=language][value=${language}]`).forEach((element) => element.checked = true);
}

function preventDisabledInput(event) {event.preventDefault()}
function changeVowelsLocale(locale) {
  if(!locale || locale.length===0) return;
  const localeStyleElement = document.getElementById('vowels-locale-style');
  const localeArray = [].concat(locale);
  const noneLocaleSelectors = localeArray.map((localeString)=> `:not([data-locale~=${localeString}])`).join('');
  const styleSheet = `
  .vowels-table__row${noneLocaleSelectors} .vowels-table__symbol{
    color: #c5c2bd;
  }
  .examples-list__item${noneLocaleSelectors} {
    display: none;
  }
  `;
  localeStyleElement.innerHTML = styleSheet;
  document.body.setAttribute('data-global-locale', localeArray.join(' '));
  
  const localeSelectors = localeArray.map((localeString)=> `[value=${localeString}]`);
  document.querySelectorAll(`[name=vowels-locale][value]`).forEach((element) => {
    element.removeAttribute('data-disabled');
    element.removeAttribute('tabIndex');
    element.removeEventListener('click',preventDisabledInput);
    element.checked = false;
  });
  localeSelectors.forEach((localSelector)=>{
    document.querySelectorAll(`[name=vowels-locale]${localSelector}`).forEach((element) => element.checked = true);
    document.querySelectorAll(`[name=vowels-locale]${localSelector}+label .t-list>li`).forEach((element) => element.removeAttribute('title'));
  });

  if(localeSelectors.length === 1) {
    const theLastLocalInput = document.querySelector(`[name=vowels-locale]${localeSelectors[0]}`);
    theLastLocalInput.setAttribute('data-disabled','');
    theLastLocalInput.setAttribute('tabIndex','-1');
    theLastLocalInput.addEventListener('click',preventDisabledInput);


    document.querySelectorAll(`[name=vowels-locale]${localeSelectors[0]}+label .t-list>li`).forEach((element) => {
      const languageClassName = element.className;
      const title = document.querySelector(`#vowels-locale__placeholder .${languageClassName}`).title;
      element.setAttribute('title', title);
    });
  }
  

  const currentRowElementLocales = currentRowElement?.getAttribute('data-locale').split(' ');
  if(currentRowElementLocales && !currentRowElementLocales.some((l)=>localeArray.includes(l))) {
    // inactive current vowel if the vowel's locale not match
    inactiveVowel();
  }
}
function changeVolume(volume) {
  const volumeInput = document.getElementById('volume');
  if(volumeInput) volumeInput.value = volume

  const volumePlaceholder = document.getElementsByClassName('volume__placeholder')[0];
  if(volumePlaceholder) volumePlaceholder.setAttribute('data-value',volume*100);

  const volumeIcon = document.querySelector('.dropdown.volume img');
  if(volumeIcon) {
    if(volume === 0)
      volumeIcon.src = './assets/images/volume-control-muted.svg';
    else
      volumeIcon.src = './assets/images/volume-control.svg';
  }
}

function changeAutoPlay(autoPlay) {
  settingFormData['auto-play'] = autoPlay;
}

document.documentElement.addEventListener('scroll',()=>{
  console.log('lala')
})