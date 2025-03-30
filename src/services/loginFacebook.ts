import { Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';

const cookiesPath = path.resolve(__dirname, '../../cookies.json');

export const loginFacebook = async (page: Page): Promise<void> => {
  console.log('🍪 Cargando cookies...');

  let cookiesCargadas = false;

  if (fs.existsSync(cookiesPath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
    await page.setCookie(...cookies);
    cookiesCargadas = true;
  }

  await page.goto('https://facebook.com', { waitUntil: 'networkidle2' });

  const estaLogueado = await page.evaluate(() => {
    return !!document.querySelector('[aria-label="Tu perfil"]');
  });

  if (cookiesCargadas && estaLogueado) {
    console.log('✅ Sesión restaurada con cookies.');
    return;
  }

  console.log('🔁 Cookies cargadas, pero no se detectó sesión activa.');
  console.log('🔐 Iniciando sesión manualmente...');

  const email = process.env.FB_USER;
  const password = process.env.FB_PASS;

  if (!email || !password) {
    throw new Error('❌ FB_USER o FB_PASS no están definidos en el archivo .env');
  }

  await page.goto('https://facebook.com/login', { waitUntil: 'networkidle2' });

  await page.evaluate(() => {
    (document.querySelector('#email') as HTMLInputElement).value = '';
    (document.querySelector('#pass') as HTMLInputElement).value = '';
  });

  await page.type('#email', email, { delay: 100 });
  await page.type('#pass', password, { delay: 100 });
  await page.click('#loginbutton');

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {
    console.log('⏳ Esperando resolución manual (captcha, 2FA, etc)...');
  });

  try {
    await page.waitForSelector('[aria-label="Tu perfil"]', { timeout: 60000 });
    console.log('✅ Login exitoso. Guardando cookies...');
    const newCookies = await page.cookies();
    fs.writeFileSync(cookiesPath, JSON.stringify(newCookies, null, 2));
  } catch {
    console.warn('⚠️ No se detectó el botón de perfil después de login. Verificar manualmente.');
  }
};
