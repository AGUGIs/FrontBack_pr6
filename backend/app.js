const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Логирование запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}][${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// === SWAGGER CONFIGURATION ===
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Магазина Кастрюль',
            version: '1.0.0',
            description: 'Документация API для итогового проекта (Практика 5)',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI по адресу /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// === БАЗА ДАННЫХ (Товары - Кастрюли) ===
let products = [
    { id: nanoid(6), name: 'Кастрюля "Шеф-Повар" 20л', category: 'Кастрюли', description: 'Нержавеющая сталь, тройное дно', price: 5990, quantity: 15 },
    { id: nanoid(6), name: 'Кастрюля эмалированная 5л', category: 'Кастрюли', description: 'Классическая эмалированная кастрюля', price: 1200, quantity: 30 },
    { id: nanoid(6), name: 'Казан чугунный 12л', category: 'Казаны', description: 'Настоящий чугун для плова', price: 3500, quantity: 8 },
    { id: nanoid(6), name: 'Сотейник антипригарный', category: 'Сотейники', description: 'Антипригарное покрытие, 24см', price: 2100, quantity: 20 },
    { id: nanoid(6), name: 'Сковорода гриль 28см', category: 'Сковороды', description: 'Чугунная сковорода-гриль', price: 2500, quantity: 12 },
    { id: nanoid(6), name: 'Ковш для молока 1.5л', category: 'Ковши', description: 'Идеален для каш и соусов', price: 890, quantity: 40 },
    { id: nanoid(6), name: 'Утятница керамическая', category: 'Формы', description: 'Керамика для запекания в духовке', price: 3200, quantity: 6 },
    { id: nanoid(6), name: 'Пароварка бамбуковая', category: 'Аксессуары', description: 'Экологичная пароварка', price: 1500, quantity: 10 },
    { id: nanoid(6), name: 'Турка медная 500мл', category: 'Кофе', description: 'Для приготовления настоящего кофе', price: 1100, quantity: 18 },
    { id: nanoid(6), name: 'Вок сковорода 32см', category: 'Сковороды', description: 'Для жарки на сильном огне', price: 2800, quantity: 9 }
];

// === SWAGGER SCHEMAS (JSDoc) ===
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный ID
 *         name:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: integer
 *           description: Цена в рублях
 *         quantity:
 *           type: integer
 *           description: Количество на складе
 *       example:
 *         id: "abc123"
 *         name: "Кастрюля 5л"
 *         category: "Кастрюли"
 *         description: "Нержавеющая сталь"
 *         price: 1200
 *         quantity: 30
 */

// === ROUTES ===

// Главная
app.get('/', (req, res) => {
    res.send('Добро пожаловать в API Магазина Кастрюль! Документация: /api-docs');
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создает новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в теле запроса
 */
app.post('/api/products', (req, res) => {
    const { name, category, description, price, quantity } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Название и цена обязательны' });
    }

    const newProduct = {
        id: nanoid(6),
        name,
        category: category || 'Другое',
        description: description || '',
        price: Number(price),
        quantity: Number(quantity) || 0
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновляет данные товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Обновленный товар
 *       404:
 *         description: Товар не найден
 */
app.patch('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    const { name, category, description, price, quantity } = req.body;
    
    if (name) product.name = name;
    if (category) product.category = category;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (quantity !== undefined) product.quantity = Number(quantity);

    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: Товар успешно удален
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', (req, res) => {
    const exists = products.some(p => p.id === req.params.id);
    
    if (!exists) {
        return res.status(404).json({ error: 'Товар не найден' });
    }
    
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

// 404 для остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger документация доступна по адресу http://localhost:${port}/api-docs`);
});