process.env["NTBA_FIX_319"] = 1;
const TOKEN = 'InsertYourTokenHere';
const url = yourHttpsHost;
const port = 80;

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const weather = require('./axios');
const bot = new TelegramBot(TOKEN);


// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);

const app = express();

var optionsDay = {
  reply_markup: {
    inline_keyboard: [
      [{
          text: 'сегодня',
          callback_data: 'fact'
        },
        {
          text: 'завтра',
          callback_data: '0'
        },
        {
          text: 'послезавтра',
          callback_data: '1'
        },
      ]
    ]
  }
}
var optionsCity = {
  reply_markup: {
    inline_keyboard: [
      [{
          text: 'Бишкек',
          callback_data: 'lat=42.8746212&lon=74.56976170000007'
        },
        {
          text: 'Москва',
          callback_data: 'lat=55.75396&lon=37.620393'
        },
        {
          text: 'Нью-Йорк',
          callback_data: 'lat=40.728333&lon=106.005833'
        },
      ]
    ]
  }
}
var keyboard = {
  reply_markup: {
    keyboard: [
      ["Бишкек", "Москва", "Нью-Йорк"]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
}
var location;
// parse the updates to JSON
app.use(bodyParser.json());
// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
})
// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
})
bot.onText(/start/i, msg => {
  bot.sendMessage(msg.chat.id, 'Я могу сообщить погоду по сообщению "погода" каппа');
});
bot.on('message', msg => {
  if (msg.text == "Бишкек") {
    location = 'lat=42.8746212&lon=74.56976170000007';
    bot.sendMessage(msg.chat.id, 'Выберите день', optionsDay);
  }
  if (msg.text == "Москва") {
    location = 'lat=55.75396&lon=37.620393';
    bot.sendMessage(msg.chat.id, 'Выберите день', optionsDay);
  }
  if (msg.text == "Нью-Йорк") {
    location = 'lat=40.728333&lon=106.005833';
    bot.sendMessage(msg.chat.id, 'Выберите день', optionsDay);
  }
});
bot.on('callback_query', async query => {

  let temp = await weather(location, query.data);
  if (temp == undefined) {
    bot.sendMessage(query.message.chat.id, 'Лимит запросов превышен, приносим извинения');
  } else {
    bot.sendMessage(query.message.chat.id, temp)
  }
});
bot.onText(/pogoda/i, msg => {
  bot.sendMessage(msg.chat.id, 'Выберите город', keyboard);
});