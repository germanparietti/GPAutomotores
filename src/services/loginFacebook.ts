import { Page } from 'puppeteer';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const COOKIES_PATH = './cookies.json';

export const loginFacebook = async (page: Page) => {
  // Intenta cargar cookies
  if (fs.existsSync(COOKIES_PATH)) {
    console.log("🍪 Cargando cookies...");
    const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
    await page.setCookie(...cookies);
    await page.goto('https://facebook.com/', { waitUntil: 'networkidle0' });
    return;
  }

  console.log('🔐 Iniciando sesión en Facebook...');
  await page.goto('https://facebook.com/login/', { waitUntil: 'networkidle0' });

  await page.type('#email', process.env.FB_USER!, { delay: 100 });
  await page.type('#pass', process.env.FB_PASS!, { delay: 100 });
  await page.click('#loginbutton');

  console.log("⚠️ Si aparece captcha o verificación, resolvelo manualmente.");
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Verificación adicional de URLs sospechosas o de verificación 2FA
  const url = page.url();
  const isCheckpoint = url.includes('checkpoint');
  const isLogin = url.includes('login');
  const isTwoStep = url.includes('two_step_verification');

  if (isCheckpoint || isLogin || isTwoStep) {
    console.log("⏳ Verificación manual detectada. Esperando que continúes...");
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
  }

  const newCookies = await page.cookies();
  fs.writeFileSync(COOKIES_PATH, JSON.stringify(newCookies, null, 2));
  console.log('✅ Sesión iniciada y cookies guardadas.');
};
