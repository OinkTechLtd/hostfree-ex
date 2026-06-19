const DOMAINS = [".hostgta.ru", "hostgta.ru", ".hostgta.com", "hostgta.com"];

async function grab() {
  const status = document.getElementById("status");
  status.textContent = "Читаю cookies...";
  status.className = "status";

  const collected = {};
  let total = 0;

  for (const domain of DOMAINS) {
    try {
      const cookies = await chrome.cookies.getAll({ 
        domain: domain 
      });
      
      if (cookies && cookies.length > 0) {
        collected[domain] = cookies.map(c => ({
          name: c.name,
          value: c.value,
          domain: c.domain,
          path: c.path,
          expirationDate: c.expirationDate,
          secure: c.secure,
          httpOnly: c.httpOnly,
          sameSite: c.sameSite
        }));
        total += cookies.length;
      }
    } catch (e) {
      console.warn(`Не удалось получить cookies для ${domain}`, e);
    }
  }

  if (total === 0) {
    status.textContent = "Cookies не найдены. Открой hostgta.ru в этой вкладке и войди в аккаунт.";
    status.className = "status err";
    return;
  }

  const payload = JSON.stringify({ 
    v: 2, 
    ts: Date.now(), 
    source: "hostfree-extension",
    cookies: collected 
  });

  try {
    await navigator.clipboard.writeText(payload);
    status.textContent = `✅ Готово! Скопировано ${total} cookies. Вставь в HostFree → Импорт сессии`;
    status.className = "status ok";
  } catch (e) {
    status.textContent = "Не удалось скопировать в буфер. Скопируй вручную:";
    console.log(payload);
  }
}

document.getElementById("grab").addEventListener("click", grab);
