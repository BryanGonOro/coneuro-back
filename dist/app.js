"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./docs/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Configure CORS
app.use((0, cors_1.default)({
    origin: ['http://localhost:3039', 'https://bryangonoro.github.io/coneuro/', 'https://bryangonoro.github.io'], // Allow the frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
// Ruta raíz
app.get('/', (req, res) => {
    res.send("Bienvenido al API");
});
// Prefijo general para la API: /api/v1
app.use('/api/v1', routes_1.default);
// Ruta para la documentación con Swagger
app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
exports.default = app;
