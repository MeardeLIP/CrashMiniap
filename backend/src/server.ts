import "dotenv/config";
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
// ВАЖНО: после обработки web_app_data вызываем next(),
// чтобы другие хендлеры (например, /start) тоже отработали.
bot.on("message", async (ctx, next) => {
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

  // Пропускаем апдейт дальше по цепочке middlewares
  return next();
});

// Логируем любые текстовые сообщения, чтобы убедиться, что апдейты доходят
// и при этом не блокируем другие хендлеры (как /start)
bot.on("text", (ctx, next) => {
  console.log("TEXT UPDATE:", ctx.chat.id, ctx.message.text);
  return next();
});

// Команда /start с кнопкой \"Play\" под сообщением (inline-клавиатура, как у GiftUp)
bot.start((ctx) => {
  ctx.reply("Запускаем краш-игру 🚀", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Play",
            web_app: {
              url: "https://meardelip.github.io/CrashMiniap/"
            }
          }
        ]
      ]
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Backend listening on port ${PORT}`);

  // Всегда сначала очищаем старый webhook, чтобы Telegram начал слать апдейты заново
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: false });
    console.log("Old webhook deleted (if it existed)");
  } catch (e) {
    console.warn("Failed to delete old webhook:", e);
  }

  const publicUrl = process.env.PUBLIC_URL;
  if (publicUrl) {
    // Регистрируем webhook на наш бэкенд
    const webhookUrl = `${publicUrl}/webhook/${BOT_TOKEN}`;
    await bot.telegram.setWebhook(webhookUrl);
    console.log("Webhook set to:", webhookUrl);
  } else {
    console.warn("PUBLIC_URL is not set, webhook was not configured, using long polling");
    await bot.launch();
    console.log("Bot started in long-polling mode");
  }
});

