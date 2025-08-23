const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1408772206032453734/XpoP6-9gk2nTtO9jHCMIBcAzh6kURmLuzyAh-xaVEkc1SBqFBBHIYaSaJ1jnubyMjwq9";

export interface VisitData {
  url: string;
  userAgent: string;
  timestamp: string;
  referrer?: string;
  language: string;
  screenResolution: string;
}

export const sendDiscordNotification = async (visitData: VisitData): Promise<void> => {
  try {
    const embed = {
      title: "🔍 Truy cập website StudyHubBKU",
      color: 0x5865F2, // Discord blurple color
      fields: [
        {
          name: "📄 Trang",
          value: visitData.url,
          inline: true
        },
        {
          name: "🕒 Thời gian",
          value: visitData.timestamp,
          inline: true
        },
        {
          name: "🌐 Trình duyệt",
          value: visitData.userAgent.split(' ')[0] || "Unknown",
          inline: true
        },
        {
          name: "🗣️ Ngôn ngữ",
          value: visitData.language,
          inline: true
        },
        {
          name: "📱 Độ phân giải",
          value: visitData.screenResolution,
          inline: true
        },
        {
          name: "🔗 Referrer",
          value: visitData.referrer || "Direct access",
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "StudyHubBKU Analytics"
      }
    };

    const payload = {
      embeds: [embed]
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
  }
};

export const trackPageVisit = (path: string): void => {
  const visitData: VisitData = {
    url: `${window.location.origin}${window.location.pathname}#${path}`,
    userAgent: navigator.userAgent,
    timestamp: new Date().toLocaleString('vi-VN', { 
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    referrer: document.referrer,
    language: navigator.language,
    screenResolution: `${screen.width}x${screen.height}`
  };

  // Send notification asynchronously without blocking the UI
  sendDiscordNotification(visitData);
};
