import 'dotenv/config';
import puppeteer from 'puppeteer';
import { loginFacebook } from '../services/loginFacebook';


(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  await loginFacebook(page);

  // Verificación opcional: detectar que la sesión esté iniciada mostrando el nombre del usuario
  try {
    await page.waitForSelector('[aria-label="Tu perfil"]', { timeout: 5000 });
    console.log('🟢 Verificado: sesión iniciada correctamente (detectado botón de perfil).');
  } catch {
    console.warn('🟡 No se encontró el botón de perfil. Puede que el login haya fallado.');
  }

  console.log('✅ Test finalizado. Cerrando navegador...');
  await browser.close();
})();
