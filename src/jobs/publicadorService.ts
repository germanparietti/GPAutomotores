import puppeteer from 'puppeteer';
import { AppDataSource } from '../config/data-source';
import { Grupo } from '../entities/Grupo';
import { Publicacion } from '../entities/Publicacion';
import { loginFacebook } from '../services/loginFacebook';
import { publicarEnGrupo } from '../services/publicarEnGrupo';
import { SolicitudEstado } from '../enums/SolicitudEstado';
import { delay } from '../utils/delay';

export const ejecutarBot = async () => {
  const grupoRepo = AppDataSource.getRepository(Grupo);
  const pubRepo = AppDataSource.getRepository(Publicacion);

  const grupos = await grupoRepo.find({
    where: {
      estado: 0,
      solicitud: SolicitudEstado.ACEPTADA,
    },
  });

  const publicaciones = await pubRepo.find();

  if (!grupos.length || !publicaciones.length) {
    console.log('❌ No hay grupos o publicaciones disponibles.');
    return;
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--start-maximized', '--disable-notifications'],
    timeout: 60000,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  page.setDefaultTimeout(0);
  page.setDefaultNavigationTimeout(0);

  await loginFacebook(page);

  for (const grupo of grupos) {
    const pub = publicaciones[Math.floor(Math.random() * publicaciones.length)];

    console.log(`📢 Publicando en grupo: ${grupo.nombre}`);

    const resultado = await publicarEnGrupo(page, grupo, pub);

    grupo.estado = resultado === 'exito' ? 1 : -1;
    await grupoRepo.save(grupo);

    console.log(`✅ Resultado en grupo "${grupo.nombre}": ${resultado.toUpperCase()}`);
    await delay(5000); // espera entre publicaciones
  }

  await browser.close();
  console.log('🛑 Bot finalizado');
};
