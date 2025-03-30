import 'dotenv/config'; // <- Carga las variables del archivo .env
import puppeteer from 'puppeteer';
import { loginFacebook } from '../services/loginFacebook';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-maximized'],
    timeout: 60000,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  await loginFacebook(page);

  console.log('✅ Test finalizado. Cerrando navegador...');
  await browser.close();
})();
