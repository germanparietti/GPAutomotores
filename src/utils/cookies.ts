import fs from 'fs';

const COOKIES_PATH = './cookies.json';

export const saveCookies = async (cookies: any[]) => {
  fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
};

export const loadCookies = (): any[] | null => {
  if (fs.existsSync(COOKIES_PATH)) {
    const cookies = fs.readFileSync(COOKIES_PATH, 'utf-8');
    return JSON.parse(cookies);
  }
  return null;
};
