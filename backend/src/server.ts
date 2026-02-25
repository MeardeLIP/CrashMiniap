import express from "express";
import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set in environment variables");
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());

// Webhook endpoint для Telegram
app.post(`/webhook/${BOT_TOKEN}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// Простой healthcheck
app.get("/", (_req, res) => {
  res.send("Crash miniapp backend is running");
});

// Обрабатываем данные из WebApp (Telegram.WebApp.sendData)
bot.on("message", async (ctx) => {
  const anyMsg = ctx.message as any;
  const webAppData = anyMsg?.web_app_data;

  if (webAppData?.data) {
    try {
      const payload = JSON.parse(webAppData.data);
      console.log("Received web_app_data:", payload);

      // TODO: тут можно сохранить ставку в БД, проверить баланс и т.д.
      // Пример простого ответа пользователю:
      if (payload.action === "bet" && typeof payload.amount === "number") {
        await ctx.reply(`Ставка принята: ${payload.amount.toFixed(2)} 💎`);
      }
    } catch (e) {
      console.error("Failed to parse web_app_data", e);
    }
  }
});

// Команда /start с кнопкой для открытия миниапки
bot.start((ctx) => {
  ctx.reply("Запускаем краш-игру 🚀", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Открыть игру",
            web_app: {
              url: "https://MeardelIP.github.io/CrashMiniap/"
            }
          }
        ]
      ],
      resize_keyboard: true
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Backend listening on port ${PORT}`);

  const publicUrl = process.env.PUBLIC_URL;
  if (publicUrl) {
    // Регистрируем webhook на наш бэкенд
    const webhookUrl = `${publicUrl}/webhook/${BOT_TOKEN}`;
    await bot.telegram.setWebhook(webhookUrl);
    console.log("Webhook set to:", webhookUrl);
  } else {
    console.warn("PUBLIC_URL is not set, webhook was not configured");
  }
});

