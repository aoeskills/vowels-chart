let inactiveVowelSymbol = () => {};
let currentRowElement;
function registerVowelsTableRow(rowElement = document.getElementById()) {
  const symbolTd = rowElement.getElementsByClassName('vowels-table__symbol')[0];
  if(!symbolTd) return;

  function isLocaleMatch () {
    const globalLocales = document.body.getAttribute('data-global-locale').split(' ');
    const vowelLocales = rowElement.getAttribute('data-locale').split(' ');

    return globalLocales.some((gl)=>vowelLocales.includes(gl));
  }
  function activate() {
    if(currentRowElement===rowElement) return;
    currentRowElement = rowElement;

    inactiveVowelSymbol();
    inactiveVowelSymbol = ()=> {symbolTd.setAttribute('data-active','false')};
    symbolTd.setAttribute('data-active','true');
    showDetail(rowElement);
  }

  let stillOver = true;
  function mouseOver() {
    if(!isLocaleMatch()) return;

    stillOver = true;
    setTimeout(() => { 
      if(!stillOver || !isLocaleMatch()) return;
      activate();
      const isAutoPlayingAudio = settingFormData['auto-play'];
      if(isAutoPlayingAudio) playAudioWithin(rowElement);
    }, 50)
  }
  function mouseOut() {
    stillOver = false;
  }

  symbolTd.addEventListener('mouseover', mouseOver);
  symbolTd.addEventListener('mouseout', mouseOut);

  function click() {
    if(!isLocaleMatch()) return;
    playAudioWithin(rowElement);
  }
  symbolTd.addEventListener('click', click);
}

function playAudioWithin(element = document.getElementById()) {
    const audioSource = element.querySelector('source');
    if(!audioSource) return;
    const audio = new Audio(audioSource.src);
    audio.volume = settingFormData.volume;
    if(audio.currentTime < 0.1 && audio.currentTime > 0) return;
    audio.play();
}

let defaultDetailPanel;
function showDetail(rowElement = document.getElementById()) {
  const panelDetail = document.querySelector('.panel .vowel-detail')
  if(!panelDetail) return;
  if(!defaultDetailPanel) defaultDetailPanel = panelDetail.cloneNode(true);
  const newRowELement = rowElement.cloneNode(true);
  panelDetail.replaceChildren(newRowELement);
}

function inactiveVowel() {
  if(!defaultDetailPanel) return;

  const panelDetail = document.querySelector('.panel .vowel-detail')
  if(!panelDetail) return;

  panelDetail.replaceWith(defaultDetailPanel.cloneNode(true));
  inactiveVowelSymbol();
  currentRowElement = undefined;
}
window.addEventListener('load',() => {
  document.getElementById('page') ?.addEventListener('click',function (event){if(event.target === this) inactiveVowel()});
  document.getElementById('chart')?.addEventListener('click',function (event){if(event.target === this) inactiveVowel()});
})