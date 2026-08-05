const SERVER_ADDRESS = 'play.ukkin.net';
const STATUS_API_URL = `https://api.mcsrvstat.us/3/${SERVER_ADDRESS}`;
const STATUS_REQUEST_TIMEOUT_MS = 5_000;

const copyBtn = document.getElementById('copy-btn');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(SERVER_ADDRESS);
    copyBtn.textContent = 'copied';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.textContent = 'copy';
      copyBtn.classList.remove('copied');
    }, 2000);
  } catch (error) {
    console.error('Clipboard write failed:', error.message);
    copyBtn.textContent = 'failed';
    copyBtn.classList.add('failed');
    setTimeout(() => {
      copyBtn.textContent = 'copy';
      copyBtn.classList.remove('failed');
    }, 2000);
  }
});

async function loadServerStatus() {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');

  try {
    const response = await fetch(STATUS_API_URL, {
      signal: AbortSignal.timeout(STATUS_REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(`Status API returned ${response.status}`);
    }
    const data = await response.json();
    dot.classList.remove('online', 'offline');

    if (data.online) {
      const online = data.players?.online ?? 0;
      const max = data.players?.max ?? '?';
      dot.classList.add('online');
      text.textContent = `Online · ${online}/${max} players`;
    } else {
      dot.classList.add('offline');
      text.textContent = 'Server is offline';
    }
  } catch (error) {
    console.error('Failed to load server status:', error.message);
    text.textContent = 'Server status unavailable';
  }
}

loadServerStatus();
setInterval(loadServerStatus, 60_000);
