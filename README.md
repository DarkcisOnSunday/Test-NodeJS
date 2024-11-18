# Test NodeJS
---
#### Для запуска проектов необходимо скачать NodeJS и в каждом проекте докачивать зависимости
```
npm install 
```
#### P.S. Я не добавлял в .gitignore .env и dist(откомпилированный ts) для удобства я знаю что так делать не стоит
---
- NodeJSTask1 (Первая задача) \
    - NodeJSTask1.1 (Первая часть первой задчи)
        Внутри есть файл для создания базы данных напрямую через js.
        Для создания достаточно средствами nodeJS запустить скрипт в проекте
        ```
        npm run createDB
        ```
        Этот код также создаёт таблицу для второго задания
        Для запуска необходимо в файл .env подставить свои данные сервера postgres и ввести в консоль
        ```
        npm start
        ```
    - NodeJSTask1.2 (Вторая часть первой задчи) \
        Поскольку таблица для данных была созданна в предыдущей части для запуска необходимо также изменить .env и ввести консоль
        ```
        npm start
        ```
---
- NodeJSTask2 (Вторая задача) \
    Для корректной работы этого проекта требуеться изменить .env и ввести в консоль
    ```
    npm run start
    ```
    Проект сам создаст базу данных после чего её нужно будет наполнить используя миграцию
    ```
    ts-node src/user/seeder.ts
    ```
    И снова запустить проект
    ```
    npm run start
    ```