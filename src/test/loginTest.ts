import puppeteer from 'puppeteer';
import { loginFacebook } from '../services/loginFacebook';

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  await loginFacebook(page);

  await browser.close();
})();
