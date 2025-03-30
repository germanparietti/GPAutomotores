import puppeteer from 'puppeteer';
import { loadCookies, saveCookies } from '../utils/cookies';
import { delay } from '../utils/delay';

(async () => {
  const browser = await puppeteer.launch({ headless: false,args: ['--start-maximized'], });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  console.log('🍪 Cargando cookies...');
  const cookies = await loadCookies();
  if (cookies && cookies.length > 0) {
    await page.setCookie(...cookies);
  }
  
  let isLoggedIn = false;
// Ir a Facebook con cookies
await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle2' });

const currentUrl = page.url();
if (currentUrl.includes('home.php')) {
  console.log('✅ Ya estás logueado (detectado por redirección a home.php).');
  isLoggedIn = true;
} else {
  console.log('🔐 Iniciando sesión manualmente...');
  await page.goto('https://www.facebook.com/login', { waitUntil: 'load' });

  for (let i = 0; i < 60; i++) {
    await delay(2000);
    const newUrl = page.url();
    if (newUrl.includes('home.php')) {
      console.log('✅ Login detectado por redirección.');
      isLoggedIn = true;
      break;
    }
  }

  if (!isLoggedIn) {
    console.log('❌ Timeout esperando login.');
    await browser.close();
    return;
  }

  console.log('✅ Login exitoso. Guardando cookies...');
  const nuevaSesion = await page.cookies();
  await saveCookies(nuevaSesion);
}


  // Abrimos una nueva página para evitar usar una página con frames viejos
  const grupoUrl = 'https://www.facebook.com/groups/1426573644216389/';
  const nuevaPage = await browser.newPage();
  console.log(`➡️ Navegando al grupo: ${grupoUrl}`);
  await nuevaPage.goto(grupoUrl, { waitUntil: 'networkidle2' });

  await delay(8000);
  await nuevaPage.evaluate(() => window.scrollBy(0, 500));
  await delay(3000);

  const xpaths = [
    '//*[contains(text(),"Escribe algo...")]',
    '//span[text()="Escribe algo..."]',
    '//span[contains(text(),"Escribe algo")]',
    '//div[contains(., "Escribe algo...")]',
  ];

  for (const xpath of xpaths) {
    try {
      const el = await nuevaPage.waitForSelector(`::-p-xpath(${xpath})`, { timeout: 5000 });
      if (el) {
        console.log(`✅ Elemento encontrado con XPath: ${xpath}`);
      }
    } catch {
      console.log(`❌ Elemento no encontrado con XPath: ${xpath}`);
    }
  }

  await nuevaPage.screenshot({ path: 'estado_actual.png' });
  await browser.close();
})();
