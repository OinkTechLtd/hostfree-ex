const DOMAINS = ["hostgta.ru", "hostgta.com"];

async function grab() {
  const status = document.getElementById("status");
  status.textContent = "Читаю cookies…";
  status.className = "status";
  const collected = {};
  let total = 0;
  for (const d of DOMAINS) {
    const cookies = await chrome.cookies.getAll({ domain: d });
    if (cookies && cookies.length) {
      collected[d] = cookies.map(c => ({ name: c.name, value: c.value, domain: c.domain, path: c.path, expirationDate: c.expirationDate, secure: c.secure, httpOnly: c.httpOnly }));
      total += cookies.length;
    }
  }
  if (total === 0) {
    status.textContent = "Cookies не найдены. Сначала войдите на hostgta в этой вкладке.";
    status.className = "status err";
    return;
  }
  const payload = JSON.stringify({ v: 1, ts: Date.now(), cookies: collected });
  try {
    await navigator.clipboard.writeText(payload);
    status.textContent = `Готово. Скопировано ${total} cookies. Откройте HostFree → «Импорт сессии» → вставьте.`;
    status.className = "status ok";
  } catch (e) {
    status.textContent = "Не удалось скопировать. Скопируйте вручную: " + payload.slice(0, 60) + "…";
    status.className = "status err";
  }
}

document.getElementById("grab").addEventListener("click", grab);
