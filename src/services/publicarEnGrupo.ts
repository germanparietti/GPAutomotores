import puppeteer, { Page, ElementHandle } from 'puppeteer';
import { Grupo } from '../entities/Grupo';
import { Publicacion } from '../entities/Publicacion';
import { delay, randomDelay } from '../utils/delay';

export const publicarEnGrupo = async (
  page: Page,
  grupo: Grupo,
  publicacion: Publicacion
): Promise<'exito' | 'fallo'> => {
  try {
    await page.goto(grupo.url);
    await delay(5000);

    const [boton] = await (page as any).$x('//span[contains(text(),"Escribe algo...")]') as [ElementHandle<Element>];


    if (!boton) return 'fallo';

    await boton.click();
    await randomDelay();

    await page.keyboard.type(publicacion.texto, { delay: 100 });

    const publicarBtn = await page.$('form div[aria-label="Publicar"]');
    if (!publicarBtn) return 'fallo';

    await publicarBtn.click();
    await delay(5000);

    return 'exito';
  } catch (err) {
    console.error('⚠️ Error al publicar en grupo:', err);
    return 'fallo';
  }
};
