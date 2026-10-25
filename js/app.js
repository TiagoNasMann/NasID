/* Sem dependências: telas, navegação e editor de foto funcionam localmente. */
'use strict';

// Todos os dados abaixo são fictícios; o identificador não é um CPF válido.
const identity = Object.freeze({
  name: 'TIAGO NASCIMENTO FAGUNDES',
  number: '70475572610',
  birth: '04/06/2007',
  birthplace: 'UBERLANDIA/MG',
  nationality: 'BRA',
  sex: 'M',
  expires: '27/08/2036',
  mother: 'VALÉRIA SILVEIRA TILLMANN',
  father: 'FÁBIO SILVEIRA TILLMANN',
});

const PHOTO_KEY = 'wallet-demo.portrait.v1';
const icons = {
  home: '<path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9"/>',
  data: '<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h4"/>',
  wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M16 12h5v5h-5z"/>',
  qr: '<path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6zM12 3v2M12 9v3H3M12 15v6M21 12h-4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  next: '<path d="m9 5 7 7-7 7"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  sign: '<path d="M4 20h16M5 15l10-11 4 4L9 19H5z"/>',
  history: '<path d="M3 10a9 9 0 1 1 1 7M3 4v6h6M12 7v6l4 2"/>',
  shield: '<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6zM8 12l3 3 5-6"/>',
  zoom: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6M10 7v6"/>',
  more: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.data}</svg>`;
const screen = document.querySelector('#screen');
const navigation = document.querySelector('#navigation');
const headerAction = document.querySelector('#header-action');
let route = 'home';
let documentPage = 0;
let portrait = 'assets/portrait.svg';
let toastTimer;

try {
  const saved = localStorage.getItem(PHOTO_KEY);
  if (saved?.startsWith('data:image/jpeg;base64,')) portrait = saved;
} catch { /* A visualização continua disponível se o armazenamento estiver bloqueado. */ }

function title(text) {
  return `<h1 class="page-title"><button class="icon-button" data-route="home" aria-label="Voltar">${icon('back')}</button>${text}</h1>`;
}

function renderNavigation() {
  const items = [['home', 'Início'], ['data', 'Dados'], ['qr', 'QR Code'], ['wallet', 'Carteira'], ['menu', 'Menu']];
  navigation.innerHTML = items.map(([key, label]) => {
    const active = route === key || (route === 'identity' && key === 'wallet');
    return `<button class="nav-item ${key === 'qr' ? 'qr' : ''} ${active ? 'active' : ''}" data-route="${key}" ${active ? 'aria-current="page"' : ''}>${icon(key)}<span>${label}</span></button>`;
  }).join('');
}

const services = [
  ['mail', 'Caixa Postal', 'mail'],
  ['wallet', 'Carteira de documentos', 'wallet'],
  ['sign', 'Assinar documentos digitalmente', 'sign'],
  ['history', 'Consultar serviços solicitados', 'requests'],
  ['qr', 'Login sem senha (QR code)', 'qr'],
  ['shield', 'Prova de vida', 'life'],
];

function homeScreen() {
  const rows = services.map(([symbol, label, target]) => `<button class="service" data-route="${target}" data-service="${label.toLocaleLowerCase('pt-BR')}">${icon(symbol)}<span>${label}</span>${icon('next')}</button>`).join('');
  return `<section class="account-banner"><h1>Olá, <strong>LUCAS EXEMPLO</strong></h1><p>SUA CONTA É NÍVEL <strong>OURO</strong></p><button data-action="level">◉ VER NÍVEL</button></section><section class="home-content"><input class="search" type="search" placeholder="Encontre Serviços do Governo do Br..." aria-label="Buscar serviços"/><section class="service-panel"><h2 class="section-title">Serviços</h2>${rows}</section><section class="service-panel"><h2 class="section-title">Minha Conta</h2>${rows}</section></section>`;
}

function walletScreen() {
  return `${title('Carteira de<br>documentos')}<section class="wallet-content"><button class="wallet-card" data-route="identity" aria-label="Abrir Carteira de Identidade"><img class="wallet-original" src="assets/wallet-cover.avif" alt="Carteira de Identidade — CPF"/></button><button class="green-button" data-action="add-document">Adicionar Documento</button></section>`;
}

function field(label, value, wide = false) {
  return `<p class="${wide ? 'wide' : ''}"><small>${label}</small>${value}</p>`;
}

function frontCard() {
  return `<article class="identity-card" aria-label="Frente da identidade"><span class="document-emblem"><img src="assets/brasao-republica.png" alt="Brasão da República" /></span><header class="document-header"><strong>REPÚBLICA FEDERATIVA DO BRASIL</strong><span class="document-government">GOVERNO FEDERAL</span>Estado de Minas Gerais<br>Polícia Civil do Estado de Minas Gerais<h2>CARTEIRA DE IDENTIDADE</h2></header><div class="identity-body"><button class="portrait-button" data-action="photo" aria-label="Alterar foto da identidade"><img src="${portrait}" alt="Foto da identidade"/></button><div class="identity-fields">${field('Nome / Name', identity.name, true)}${field('Nome Social / Social Name', '—', true)}${field('Registro Geral - CPF / Personal Number', identity.number)}${field('Sexo / Sex', identity.sex)}${field('Data de Nascimento / Date of Birth', identity.birth)}${field('Nacionalidade / Nationality', identity.nationality)}${field('Naturalidade / Place of Birth', identity.birthplace)}${field('Validade / Expiry', identity.expires)}</div></div><div class="signature">Cauà Tillmann<small>Assinatura do Titular / Cardholder’s Signature</small></div></article>`;
}

function reverseCard() {
  return `<article class="identity-card back-card"><div class="reverse-top"><img class="reverse-qr" src="assets/identity-qr.svg" alt="QR Code dos dados fictícios"/><div class="identity-fields">${field('Filiação / Filiation', `${identity.mother}<br><br>${identity.father}`, true)}${field('Órgão Expedidor / Card Issuer', 'Polícia Civil do Estado de Minas Gerais', true)}${field('Local / Place of Issue', identity.birthplace)}${field('Data de Emissão / Issue Date', '24/06/2025')}</div><img class="reverse-portrait" src="${portrait}" alt="Foto da identidade"/></div><div class="reverse-signature">Cauà Tillmann<small>Assinatura do Expedidor / Card Issuer’s Signature</small></div><div class="document-code" aria-label="Identificador fictício">IDBRA707642696770764269607&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br>8947920019201290123BRA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br>TILLMANN&lt;SILVEIRA&lt;CAUA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div></article>`;
}

function supplementaryCard() {
  const cells = [
    ['Título de eleitor', '—'], ['Tipo sanguíneo / Fator RH', '—'],
    ['Estado civil', 'SOLTEIRO(A)'], ['Doador de órgãos', 'NÃO'],
    ['Assinatura', 'Cauà Tillmann'], ['Certidão de Nasc. / Casamento / Averbação / Divórcio', 'TIPO: NASCIMENTO · LIVRO: EXEMPLO · FOLHA: 00'],
    ['CNH', '—'], ['Categoria', '—'], ['NIS', '—'], ['NIT', '—'],
    ['PIS / PASEP', '—'], ['Carteira de trabalho', '—'], ['DNI', '—'], ['CNS', '—'], ['Observação de saúde', '—'],
  ];
  return `<article class="identity-card supplementary-card"><div class="supplementary-grid">${cells.map(([label,value])=>`<div><small>${label}</small><span>${value}</span></div>`).join('')}</div></article>`;
}

function qrCard() {
  return `<section class="qr-page"><p>Documento de identificação<br>${identity.name}<br>${identity.number}</p><img src="assets/identity-qr.svg" alt="QR Code contendo os dados fictícios da identidade"/><p>Leia o QR Code para consultar<br>os dados deste documento.</p></section>`;
}

function identityScreen() {
  const pages = [frontCard, reverseCard, supplementaryCard, qrCard];
  return `<h1 class="identity-heading">DOCUMENTO DE IDENTIFICAÇÃO</h1><div class="document-stage" tabindex="0" aria-label="Páginas da identidade: deslize para os lados">${pages.map((page,index)=>`<div class="document-slide" aria-label="Página ${index+1} de 4">${page()}</div>`).join('')}</div><div class="document-controls"><button class="icon-button zoom-button" data-action="zoom" aria-label="Ampliar documento">${icon('zoom')}</button><div class="page-dots" aria-label="Páginas do documento">${pages.map((_, index) => `<button data-page="${index}" class="${index === documentPage ? 'active' : ''}" aria-label="Página ${index + 1}" aria-current="${index === documentPage}"></button>`).join('')}</div><button class="icon-button" data-action="next-page" aria-label="Próxima página">${icon('next')}</button><button class="icon-button more-button" data-action="document-menu" aria-label="Opções do documento" aria-expanded="false">${icon('more')}</button></div>`;
}

function dataScreen() {
  return `${title('Dados pessoais')}<section class="content"><dl class="data-list"><dt>Nome</dt><dd>${identity.name}</dd><dt>CPF</dt><dd>${identity.number}</dd><dt>Data de nascimento</dt><dd>${identity.birth}</dd><dt>Naturalidade</dt><dd>${identity.birthplace}</dd></dl></section>`;
}

function navigate(nextRoute, updateHistory = true) {
  if (nextRoute === 'menu') return openMenu();
  route = nextRoute;
  closeMenu();
  const screens = { home: homeScreen, wallet: walletScreen, identity: identityScreen, data: dataScreen };
  const auxiliary = {
    qr: ['QR Code', 'qr', 'Nenhum código disponível nesta versão local.'],
    mail: ['Caixa Postal', 'mail', 'Você não possui novas mensagens.'],
    sign: ['Assinar documentos digitalmente', 'sign', 'Nenhum documento disponível para assinatura.'],
    requests: ['Serviços solicitados', 'history', 'Você não possui solicitações.'],
    life: ['Prova de vida', 'shield', 'Nenhuma comprovação disponível nesta versão local.'],
  };
  if (screens[route]) screen.innerHTML = screens[route]();
  else if (auxiliary[route]) {
    const [heading, symbol, message] = auxiliary[route];
    screen.innerHTML = `${title(heading)}<section class="simple-page">${icon(symbol)}<p>${message}</p></section>`;
  } else return navigate('home', updateHistory);
  headerAction.innerHTML = icon(route === 'identity' ? 'close' : 'user');
  headerAction.dataset.route = route === 'identity' ? 'wallet' : 'data';
  headerAction.setAttribute('aria-label', route === 'identity' ? 'Fechar documento' : 'Meus dados');
  renderNavigation();
  screen.scrollTop = 0;
  if (updateHistory) history.pushState(null, '', `#${route}`);
  screen.focus({ preventScroll: true });
  requestAnimationFrame(() => { fitDocument(); setupCarousel(); });
}

function fitDocument() {
  const stage = document.querySelector('.document-stage');
  if (!stage) return;
  const scale = stage.clientWidth / 364;
  stage.style.setProperty('--card-scale', scale);
  stage.style.setProperty('--document-height', `${580 * scale}px`);
}

function updatePageIndicators() {
  document.querySelectorAll('[data-page]').forEach(dot => {
    const current = Number(dot.dataset.page) === documentPage;
    dot.classList.toggle('active', current);
    dot.setAttribute('aria-current', String(current));
  });
}

function goToDocumentPage(page) {
  documentPage = Math.max(0, Math.min(3, page));
  const stage = document.querySelector('.document-stage');
  stage?.scrollTo({ left: stage.clientWidth * documentPage, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  updatePageIndicators();
}

function setupCarousel() {
  const stage = document.querySelector('.document-stage');
  if (!stage) return;
  stage.scrollLeft = stage.clientWidth * documentPage;
  let indicatorFrame = 0;
  stage.addEventListener('scroll', () => {
    if (indicatorFrame) return;
    indicatorFrame = requestAnimationFrame(() => {
      indicatorFrame = 0;
      if (!stage.isConnected || !stage.clientWidth) return;
      const page = Math.max(0, Math.min(3, Math.round(stage.scrollLeft / stage.clientWidth)));
      if (page === documentPage) return;
      documentPage = page;
      updatePageIndicators();
    });
  }, { passive: true });
  stage.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goToDocumentPage(documentPage + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  // O toque usa rolagem nativa; o mouse recebe o mesmo gesto de arraste.
  let drag = null;
  let coastFrame = 0;
  let suppressClick = false;
  stage.addEventListener('pointerdown', event => {
    cancelAnimationFrame(coastFrame);
    suppressClick = false;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { start: event.clientX, left: stage.scrollLeft, moved: false, x: event.clientX, time: performance.now(), velocity: 0 };
  });
  stage.addEventListener('pointermove', event => {
    if (!drag || !(event.buttons & 1)) return;
    const distance = event.clientX - drag.start;
    if (drag.moved || Math.abs(distance) > 3) {
      const now = performance.now();
      const elapsed = Math.max(1, now - drag.time);
      drag.velocity = .65 * ((drag.x - event.clientX) / elapsed) + .35 * drag.velocity;
      drag.x = event.clientX;
      drag.time = now;
      drag.moved = true;
      stage.classList.add('dragging');
      stage.setPointerCapture(event.pointerId);
      stage.scrollLeft = drag.left - distance;
    }
  });
  stage.addEventListener('pointerup', () => {
    if (!drag) return;
    suppressClick = drag.moved;
    let velocity = performance.now() - drag.time < 80 ? drag.velocity : 0;
    let previous = performance.now();
    drag = null;
    stage.classList.remove('dragging');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const coast = now => {
      if (!stage.isConnected) return;
      const elapsed = Math.min(32, now - previous);
      previous = now;
      const before = stage.scrollLeft;
      stage.scrollLeft += velocity * elapsed;
      velocity *= Math.exp(-elapsed / 180);
      if (Math.abs(velocity) > .02 && Math.abs(stage.scrollLeft - before) > .1) coastFrame = requestAnimationFrame(coast);
    };
    if (Math.abs(velocity) > .02) coastFrame = requestAnimationFrame(coast);
  });
  stage.addEventListener('click', event => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);
  stage.addEventListener('wheel', () => cancelAnimationFrame(coastFrame), { passive: true });
  stage.addEventListener('pointercancel', () => { drag = null; stage.classList.remove('dragging'); });
  stage.addEventListener('dragstart', event => event.preventDefault());
}

function showInfo(heading, message) {
  document.querySelector('#info-title').textContent = heading;
  document.querySelector('#info-content').textContent = message;
  document.querySelector('#info-dialog').showModal();
}

function toast(message) {
  const element = document.querySelector('#toast');
  clearTimeout(toastTimer);
  element.textContent = message;
  element.hidden = false;
  toastTimer = setTimeout(() => { element.hidden = true; }, 4500);
}

function closeMenu() {
  document.querySelector('.menu-shade')?.remove();
  document.querySelector('.drawer')?.remove();
}

function openMenu() {
  if (document.querySelector('.drawer')) return closeMenu();
  document.querySelector('.mobile-app').insertAdjacentHTML('beforeend', `<button class="menu-shade" data-action="close-menu" aria-label="Fechar menu"></button><aside class="drawer" aria-label="Menu"><h2>gov.br</h2><p>Versão 3.71 (build 1)</p><div class="drawer-items"><button data-action="biometrics">${icon('shield')}<span>Ativar login com biometria do celular</span></button><button data-route="home">${icon('history')}<span>Rever telas de entrada do aplicativo</span></button><button data-action="privacy">${icon('shield')}<span>Termo de Uso e Aviso de Privacidade</span></button><button data-action="logout">${icon('data')}<span>Sair e desvincular sua conta deste aparelho</span></button></div></aside>`);
}

// Um único ponto de entrada para ações evita listeners duplicados ao trocar de tela.
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.route) return navigate(button.dataset.route);
  if (button.dataset.page !== undefined) {
    return goToDocumentPage(Number(button.dataset.page));
  }
  switch (button.dataset.action) {
    case 'photo': openPhotoEditor(); break;
    case 'next-page': goToDocumentPage((documentPage + 1) % 4); break;
    case 'zoom': {
      const stage = document.querySelector('.document-stage');
      const slide = stage.querySelectorAll('.document-slide')[documentPage];
      slide.classList.toggle('zoomed');
      button.setAttribute('aria-pressed', slide.classList.contains('zoomed'));
      break;
    }
    case 'document-menu': {
      const existing = document.querySelector('.document-menu');
      if (existing) existing.remove();
      else screen.insertAdjacentHTML('beforeend', '<div class="document-menu"><button data-action="photo">Alterar foto</button><button data-action="document-details">Informações do documento</button></div>');
      button.setAttribute('aria-expanded', String(!existing));
      break;
    }
    case 'document-details': document.querySelector('.document-menu')?.remove(); goToDocumentPage(2); break;
    case 'close-menu': closeMenu(); break;
    case 'level': showInfo('Nível Ouro', 'Nível exibido pela demonstração local. Não há autenticação ou consulta de conta.'); break;
    case 'add-document': showInfo('Adicionar Documento', 'A Carteira de Identidade já está disponível. Selecione o cartão para abrir.'); break;
    case 'biometrics': showInfo('Biometria', 'O site local não solicita nem armazena biometria.'); break;
    case 'privacy': showInfo('Privacidade', 'A foto fica somente no armazenamento deste navegador. Nenhum dado é enviado a um servidor.'); break;
    case 'logout': navigate('home'); toast('Não há uma conta conectada.'); break;
  }
});

document.addEventListener('input', event => {
  if (!event.target.matches('.search')) return;
  const query = event.target.value.toLocaleLowerCase('pt-BR').trim();
  document.querySelectorAll('[data-service]').forEach(row => { row.hidden = !row.dataset.service.includes(query); });
});

// A imagem é recortada no cliente, reduzida e armazenada sem dados EXIF.
const photoDialog = document.querySelector('#photo-dialog');
const fileInput = document.querySelector('#photo-file');
const cropImage = document.querySelector('#crop-image');
const saveButton = document.querySelector('#save-photo');
const photoError = document.querySelector('#photo-error');
const sliders = ['zoom', 'x', 'y'].map(key => document.querySelector(`#crop-${key}`));
let sourceImage = null;
let fileSequence = 0;

function openPhotoEditor() {
  document.querySelector('.document-menu')?.remove();
  sourceImage = null;
  fileInput.value = '';
  saveButton.disabled = true;
  photoError.textContent = '';
  cropImage.src = portrait;
  cropImage.style.cssText = 'width:150px;height:200px;left:0;top:0;object-fit:cover';
  sliders.forEach((slider, i) => { slider.value = i === 0 ? '1' : '0'; });
  photoDialog.showModal();
}

function cropGeometry(width = 150, height = 200) {
  const [zoom, x, y] = sliders.map(slider => Number(slider.value));
  const scale = Math.max(width / sourceImage.width, height / sourceImage.height) * zoom;
  const imageWidth = sourceImage.width * scale;
  const imageHeight = sourceImage.height * scale;
  return { imageWidth, imageHeight, left: (width - imageWidth) * (x + 1) / 2, top: (height - imageHeight) * (y + 1) / 2 };
}

function updateCropPreview() {
  if (!sourceImage) return;
  const { imageWidth, imageHeight, left, top } = cropGeometry();
  cropImage.style.cssText = `width:${imageWidth}px;height:${imageHeight}px;left:${left}px;top:${top}px`;
}

fileInput.addEventListener('change', async () => {
  const sequence = ++fileSequence;
  const file = fileInput.files[0];
  saveButton.disabled = true;
  photoError.textContent = '';
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    photoError.textContent = 'Selecione uma imagem JPG, PNG ou WebP.';
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    photoError.textContent = 'A imagem deve ter até 10 MB.';
    return;
  }
  const url = URL.createObjectURL(file);
  const image = new Image();
  try {
    image.src = url;
    await image.decode();
    if (sequence !== fileSequence || !photoDialog.open) return;
    sourceImage = image;
    cropImage.src = url;
    sliders.forEach((slider, i) => { slider.value = i === 0 ? '1' : '0'; });
    updateCropPreview();
    saveButton.disabled = false;
  } catch { photoError.textContent = 'Não foi possível abrir esta imagem.'; }
  finally {
    // O navegador mantém os pixels decodificados após liberar a URL temporária.
    cropImage.onload = () => URL.revokeObjectURL(url);
    if (sequence !== fileSequence || !photoDialog.open) URL.revokeObjectURL(url);
  }
});

sliders.forEach(slider => slider.addEventListener('input', updateCropPreview));
saveButton.addEventListener('click', () => {
  if (!sourceImage) return;
  const canvas = document.createElement('canvas');
  canvas.width = 450;
  canvas.height = 600;
  const context = canvas.getContext('2d');
  const { imageWidth, imageHeight, left, top } = cropGeometry(450, 600);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(sourceImage, left, top, imageWidth, imageHeight);
  const result = canvas.toDataURL('image/jpeg', 0.9);
  try { localStorage.setItem(PHOTO_KEY, result); }
  catch {
    photoError.textContent = 'O navegador bloqueou o salvamento. Libere o armazenamento local e tente novamente.';
    return;
  }
  portrait = result;
  photoDialog.close();
  navigate('identity', false);
  toast('Foto alterada e salva neste navegador.');
});

photoDialog.addEventListener('close', () => { fileSequence++; });
window.addEventListener('hashchange', () => navigate(location.hash.slice(1) || 'home', false));
new ResizeObserver(fitDocument).observe(screen);
navigate(location.hash.slice(1) || 'home', false);
