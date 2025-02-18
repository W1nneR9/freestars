import logging
import os
from datetime import datetime
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, FSInputFile
from aiogram.filters import Command
import asyncio

TOKEN = "7719344191:AAEeSvcUdKKusoFHFBDptU4D5TKW_YW7Sb4"  # Замени на свой токен
CHECK_CHANNEL = "@freepodarkitg"  # Канал для проверки подписки
SPONSOR_CHANNELS = [
    ("Спонсор 1", "https://t.me/+mgWOYM5xPbA0MGQy"),
    ("Спонсор 2", "https://t.me/+SnF1AIfzLqQyMTRi"),
    ("Спонсор 3", "https://t.me/+lI7GtGXIGlgyYmIy"),
    ("Спонсор 4", "https://t.me/freepodarkitg"),
]

PHOTO_PATH = "starsfree.png"  # Путь к фото (замени на нужный файл)
PHOTO_URL = "https://example.com/photo.jpg"  # Если используешь URL

# Создаем папку logs, если её нет
LOGS_DIR = "logs"
if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)

# Логирование ошибок
logging.basicConfig(level=logging.INFO)

# Создаем бота и диспетчер
bot = Bot(token=TOKEN)
dp = Dispatcher()

# Словарь для отслеживания попыток
user_attempts = {}


# Функция для записи информации о пользователе в лог-файл
def log_user_info(user: types.User):
    log_file = os.path.join(LOGS_DIR, f"{user.id}.txt")
    with open(log_file, "w", encoding="utf-8") as file:
        file.write(f"Имя: {user.full_name}\n")
        file.write(f"Telegram ID: {user.id}\n")
        file.write(f"Username: @{user.username if user.username else 'Нет'}\n")
        file.write(f"Дата входа: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")


# Функция для проверки подписки
async def check_subscription(user_id: int) -> bool:
    try:
        member = await bot.get_chat_member(CHECK_CHANNEL, user_id)
        return member.status in ["member", "administrator", "creator"]
    except Exception as e:
        logging.error(f"Ошибка проверки подписки: {e}")
        return False


# Функция для отправки сообщения с кнопками подписки
async def send_subscription_message(user_id, message_text):
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=name, url=url)] for name, url in SPONSOR_CHANNELS
        ] + [[InlineKeyboardButton(text="✅ Я подписался", callback_data="check_subscription")]]
    )

    await bot.send_message(user_id, message_text, reply_markup=keyboard)


# Стартовое сообщение с фото
@dp.message(Command("start"))
async def start(message: types.Message):
    user_id = message.from_user.id
    user_attempts[user_id] = 0  # Сброс счетчика попыток

    # Логируем пользователя
    log_user_info(message.from_user)

    # Отправляем фото с описанием
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=name, url=url)] for name, url in SPONSOR_CHANNELS
        ] + [[InlineKeyboardButton(text="✅ Я подписался", callback_data="check_subscription")]]
    )

    if os.path.exists(PHOTO_PATH):  # Если фото локальное
        photo = FSInputFile(PHOTO_PATH)
        await bot.send_photo(
            user_id,
            photo,
            caption="👋 Привет!\n\n"
                    "Это телеграм-бот для заработка ⭐ звезд.\n\n"
                    "Чтобы начать, подпишись на всех наших спонсоров и нажми «Я подписался».",
            reply_markup=keyboard
        )
    else:  # Если используем URL
        await bot.send_photo(
            user_id,
            PHOTO_URL,
            caption="👋 Привет!\n\n"
                    "Это телеграм-бот для заработка ⭐ звезд.\n\n"
                    "Чтобы начать, подпишись на всех наших спонсоров и нажми «Я подписался».",
            reply_markup=keyboard
        )


# Проверка подписки (с учетом попыток)
@dp.callback_query(lambda c: c.data == "check_subscription")
async def check_sub(callback: types.CallbackQuery):
    user_id = callback.from_user.id
    user_attempts[user_id] += 1  # Увеличиваем счетчик попыток

    if user_attempts[user_id] < 3:
        # Первый и второй раз просто напоминаем
        await send_subscription_message(user_id, "⚠️ Подпишись на спонсоров, иначе не сможешь пользоваться ботом!")
    else:
        # Третий раз проверяем подписку
        subscribed = await check_subscription(user_id)
        if subscribed:
            await callback.message.edit_text(
                "🎉 Ты все выполнил! Бот работает, ты можешь зарабатывать деньги.\n\n"
                "⏳ Сейчас бот на техническом перерыве. Возвращайся позже!"
            )
        else:
            # Если не подписался, снова отправляем кнопки
            await send_subscription_message(user_id, "❌ Ты не подписался! Подпишись и попробуй снова.")


# Запуск бота
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
