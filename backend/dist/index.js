"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var apiErrorHandler_1 = __importDefault(require("./middleware/apiErrorHandler"));
var initParse_1 = __importDefault(require("./utils/initParse"));
var authRoutes_1 = __importDefault(require("./routes/authRoutes"));
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
var postRoutes_1 = __importDefault(require("./routes/postRoutes"));
var app = express_1.default();
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/groups', groupRoutes_1.default);
app.use('/api/v1/posts', postRoutes_1.default);
app.use(apiErrorHandler_1.default);
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    initParse_1.default();
    console.log("Server runnning on port " + PORT);
});
