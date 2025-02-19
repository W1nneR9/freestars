# Використовуємо Python 3.10
FROM python:3.10

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо файли в контейнер
COPY . .

# Встановлюємо залежності
RUN pip install --no-cache-dir -r requirements.txt

# Запускаємо бота
CMD ["python", "bot1.py"]
