import { Page } from 'puppeteer';
import { Grupo } from '../entities/Grupo';
import { Publicacion } from '../entities/Publicacion';
import { delay, randomDelay } from '../utils/delay';

export const publicarEnGrupo = async (
  page: Page,
  grupo: Grupo,
  publicacion: Publicacion
): Promise<'exito' | 'fallo'> => {
  try {
    console.log(`➡️ Navegando al grupo: ${grupo.url}`);
    await page.goto(grupo.url, { waitUntil: 'networkidle2' });
    await delay(6000); // Esperamos que cargue bien

    // Intentar encontrar el botón "Escribe algo..."
    // const [boton] = await page.$x('//span[contains(text(),"Escribe algo")]');
    const boton = await page.waitForSelector(`::-p-xpath(${'//span[contains(text(),"Escribe algo")]'})`, { timeout: 5000 });
    if (!boton) {
      console.log('🛑 No se encontró el botón para escribir.');
      return 'fallo';
    }

    await boton.click();
    await randomDelay();

    await page.keyboard.type(publicacion.texto, { delay: 80 });

    const publicarBtn = await page.$('form div[aria-label="Publicar"]');
    if (!publicarBtn) {
      console.log('🛑 No se encontró el botón "Publicar".');
      return 'fallo';
    }

    await publicarBtn.click();
    await delay(5000); // Esperamos que se publique

    console.log('✅ Publicación realizada con éxito');
    return 'exito';
  } catch (err) {
    console.error('⚠️ Error al publicar en grupo:', err);
    return 'fallo';
  }
};
