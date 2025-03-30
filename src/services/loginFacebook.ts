import { Page } from 'puppeteer';

export const loginFacebook = async (page: Page) => {
  console.log('🔐 Iniciando sesión en Facebook...');
  await page.goto('https://facebook.com/login/', { waitUntil: 'networkidle0' });

  await page.type('#email', process.env.FB_USER!, { delay: 100 });
  await page.type('#pass', process.env.FB_PASS!, { delay: 100 });
  await page.click('#loginbutton');

  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('✅ Sesión iniciada');
};
