const DOMAINS = [
  "hostgta.ru",
  ".hostgta.ru",
  "hostgta.com",
  ".hostgta.com"
];

async function grab() {
  const status = document.getElementById("status");
  status.textContent = "Читаю cookies...";
  status.className = "status";

  const collected = {};
  let total = 0;

  for (const domain of DOMAINS) {
    try {
      const cookies = await chrome.cookies.getAll({ domain: domain });
      console.log(`Для ${domain} найдено cookies:`, cookies.length); // для отладки

      if (cookies && cookies.length > 0) {
        collected[domain] = cookies.map(c => ({
          name: c.name,
          value: c.value,
          domain: c.domain,
          path: c.path,
          expirationDate: c.expirationDate,
          secure: c.secure,
          httpOnly: c.httpOnly,
          sameSite: c.sameSite || "lax"
        }));
        total += cookies.length;
      }
    } catch (e) {
      console.error(`Ошибка для ${domain}:`, e);
    }
  }

  console.log("Всего cookies собрано:", total);

  if (total === 0) {
    status.innerHTML = `Cookies не найдены.<br><br>
      <b>Что попробовать:</b><br>
      1. Перезагрузи страницу hostgta.ru (F5)<br>
      2. Убедись, что ты залогинен<br>
      3. Перезагрузи расширение в chrome://extensions/`;
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
    status.textContent = `✅ Успешно! Скопировано ${total} cookies. Вставляй в HostFree.`;
    status.className = "status ok";
  } catch (e) {
    status.textContent = "Не удалось скопировать. Открой консоль (F12) и посмотри логи.";
    console.log("Payload:", payload);
  }
}

document.getElementById("grab").addEventListener("click", grab);
