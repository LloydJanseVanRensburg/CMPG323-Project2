"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlinkFile = void 0;
// ENV Variables served to app
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Core Node
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
// 3rd Party Modules
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
// Custom Middleware
var apiErrorHandler_1 = __importDefault(require("./middleware/apiErrorHandler"));
// Route Imports
var authRoutes_1 = __importDefault(require("./routes/authRoutes"));
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
var postRoutes_1 = __importDefault(require("./routes/postRoutes"));
var imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
// DB Connection Function
var db_1 = require("./config/db");
exports.unlinkFile = util_1.default.promisify(fs_1.default.unlink);
// Init Express App
var app = express_1.default();
// Set up basic middlewares
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
// App Routing Middleware
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/groups', groupRoutes_1.default);
app.use('/api/v1/posts', postRoutes_1.default);
app.use('/api/v1/image', imageRoutes_1.default);
// App Global Error Handler Middleware
app.use(apiErrorHandler_1.default);
// Init Server and listen
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    db_1.connectDB();
    console.log("Server runnning on port " + PORT);
});
