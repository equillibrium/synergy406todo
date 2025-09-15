To-Do List Application (Vue 3 + Nuxt 3)
Веб-приложение для управления задачами с современным стеком технологий.

🚀 Технологии
Frontend: Vue 3 (Composition API)

Framework: Nuxt 3

Styling: CSS/SCSS (по выбору)

Deployment: GitHub Pages/Netlify

📋 Функциональность
Добавление новых задач

Отметка выполненных задач

Удаление задач

Фильтрация (Все/Активные/Завершенные)

Редактирование задач

Локальное сохранение данных (localStorage)

Адаптивный дизайн

🛠 Установка и запуск
Клонируйте репозиторий:

bash
git clone <repository-url>
cd todo-list-app
Установите зависимости:

bash
npm install
Запустите сервер разработки:

bash
npm run dev
Откройте http://localhost:3000 в браузере

📁 Структура проекта
text
src/
├── components/     # Vue компоненты
│   ├── TodoList.vue
│   ├── TodoItem.vue
│   └── TodoFilter.vue
├── composables/   # Composition API функции
│   └── useTodos.js
├── pages/         # Страницы приложения
│   └── index.vue
└── assets/        # Статические файлы
    └── styles/
        └── main.css
🚀 Деплой
GitHub Pages
Соберите проект: npm run generate

Настройте GitHub Actions для автоматического деплоя

Netlify
Подключите репозиторий к Netlify

Настройте сборку: Build command npm run generate, Publish directory dist

🤝 Процесс разработки
Планирование: задачи создаются в GitHub Projects

Ветвление: для каждой задачи создается отдельная ветка

Пул-реквесты: код ревью перед мерджем в main

Тестирование: проверка функциональности перед деплоем

Деплой: автоматический деплой после мерджа в main

📝 Лицензия
MIT License - см. файл LICENSE для деталей.
