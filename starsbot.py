import asyncio
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup

TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN")

SPONSORS = [
    ("Спонсор 1", "https://t.me/sponsor1"),
    ("Спонсор 2", "https://t.me/sponsor2"),
    ("Спонсор 3", "https://t.me/sponsor3"),
    ("Спонсор 4", "https://t.me/sponsor4"),
]

GIFT_BUTTONS = {
    "gift_rose": "🎁 Роза",
    "gift_rocket": "🚀 Ракета",
    "gift_cake": "🍰 Тортик",
}

bot = Bot(token=TOKEN)
dp = Dispatcher()


@dp.message(Command("start"))
async def cmd_start(message: types.Message) -> None:
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=name, url=url)] for name, url in SPONSORS
        ]
        + [[InlineKeyboardButton(text="Проверить подписки", callback_data="check_subscriptions")]]
    )

    await message.answer(
        "Чтобы получить подарок, нужно подписаться на спонсоров и нажать кнопку 'Проверить подписки'.",
        reply_markup=keyboard,
    )


@dp.callback_query(lambda query: query.data == "check_subscriptions")
async def handle_check_subscriptions(callback: types.CallbackQuery) -> None:
    await callback.answer()

    countdown_message = await callback.message.answer("Проверяю подписки… (5 секунд)")

    for remaining in range(4, 0, -1):
        await asyncio.sleep(1)
        await countdown_message.edit_text(f"Проверяю подписки… ({remaining} секунд)")

    await asyncio.sleep(1)
    await countdown_message.edit_text("✅ Проверка успешно пройдена")

    gifts_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=label, callback_data=callback_data)]
            for callback_data, label in GIFT_BUTTONS.items()
        ]
    )

    await callback.message.answer(
        "Проверка успешно пройдена!",
        reply_markup=gifts_keyboard,
    )


@dp.callback_query(lambda query: query.data in GIFT_BUTTONS)
async def handle_gift_choice(callback: types.CallbackQuery) -> None:
    await callback.answer()
    gift_label = GIFT_BUTTONS[callback.data]
    gift_name = gift_label.split(maxsplit=1)[1]

    await callback.message.answer(
        f"Вы выбрали {gift_name}.\nВ скором времени вы получите свой подарок 🎉"
    )


def main() -> None:
    asyncio.run(dp.start_polling(bot))


if __name__ == "__main__":
    main()
