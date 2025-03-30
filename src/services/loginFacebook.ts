import { Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { delay } from '../utils/delay';


const COOKIES_PATH = path.join(__dirname, '../../cookies.json');

const fbUser = process.env.FB_USER;
const fbPass = process.env.FB_PASS;
export const loginFacebook = async (page: Page) => {
  console.log('🍪 Cargando cookies...');

  if (fs.existsSync(COOKIES_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf8'));
    await page.setCookie(...cookies);
    await page.goto('https://facebook.com', { waitUntil: 'networkidle2' });

    // Verificamos si ya estamos logueados
    const isLogged = await page.evaluate(() => {
      return !!document.querySelector('div[aria-label="Crear"]');
    });

    if (isLogged) {
      console.log('✅ Sesión restaurada con cookies.');
      return;
    }

    console.log('🔁 Cookies cargadas, pero no se detectó sesión activa.');
  }

  console.log('🔐 Iniciando sesión manualmente...');
  await page.goto('https://facebook.com/login/', { waitUntil: 'networkidle2' });
 
  if (!fbUser || !fbPass) {
    throw new Error('❌ FB_USER o FB_PASS no están definidos en el archivo .env');
  }
  
  await page.type('#email', fbUser, { delay: 100 });
  await page.type('#pass', fbPass, { delay: 100 });
  await page.click('#loginbutton');

  // Esperamos a que aparezca alguna de estas condiciones:
  try {
    await Promise.race([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }),
      page.waitForSelector('input[name="approvals_code"]', { timeout: 15000 }), // 2FA
      page.waitForSelector('div[aria-label="Crear"]', { timeout: 15000 }), // Home de FB
    ]);
  } catch (err) {
    console.log('⏳ Posible CAPTCHA detectado. Esperando resolución manual...');
  }

  // Si sigue en la pantalla de login o de verificación, esperar manualmente
  let intentos = 0;
  while (true) {
    const url = page.url();
    const isLogged = await page.evaluate(() => {
      return !!document.querySelector('div[aria-label="Crear"]');
    });

    if (isLogged) {
      console.log('✅ Login exitoso.');
      break;
    }

    if (intentos > 60) {
      console.log('❌ Timeout esperando resolución manual.');
      break;
    }

    await delay(2000);
    intentos++;
  }

  const cookies = await page.cookies();
  fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
  console.log('💾 Cookies guardadas.');
};
