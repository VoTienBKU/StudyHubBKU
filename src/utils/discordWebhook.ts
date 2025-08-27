const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1408772206032453734/XpoP6-9gk2nTtO9jHCMIBcAzh6kURmLuzyAh-xaVEkc1SBqFBBHIYaSaJ1jnubyMjwq9";

// Cờ để đảm bảo chỉ gửi 1 lần khi vào site từ bên ngoài
let hasSentNotification = false;

export const sendDiscordNotification = async (message: string): Promise<void> => {
  try {
    const payload = { content: message };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to send Discord notification:", error);
  }
};

export const trackPageVisit = (path: string): void => {
  const referrer = document.referrer;

  if (!hasSentNotification && (!referrer || !referrer.startsWith(window.location.origin))) {
    hasSentNotification = true;

    const timestamp = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    let refDomain = "Direct";
    try {
      if (referrer) {
        const url = new URL(referrer);
        refDomain = url.hostname.replace("www.", "");
      }
    } catch (_) { }

    const message = `🕒 ${timestamp} — từ ${refDomain}`;
    sendDiscordNotification(message);
  }
};