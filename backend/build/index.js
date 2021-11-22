"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//=========================================IMPORTS======================================================
// ENV Variables served to app
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 3rd Party Modules
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// Database connection file
const db = require('./models/index');
// Custom Middleware
const apiErrorHandler_1 = __importDefault(require("./middleware/apiErrorHandler"));
// Route Imports
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const albumRoutes_1 = __importDefault(require("./routes/albumRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const imageRoutes_1 = __importDefault(require("./routes/imageRoutes"));
//============================================================================================================
// Init Express App
const app = (0, express_1.default)();
// Set up basic middlewares
app.use((0, cors_1.default)({ origin: '*' }));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// App Routing Middleware
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/groups', groupRoutes_1.default);
app.use('/api/v1/albums', albumRoutes_1.default);
app.use('/api/v1/posts', postRoutes_1.default);
app.use('/api/v1/image', imageRoutes_1.default);
// App Global Error Handler Middleware
app.use(apiErrorHandler_1.default);
// Init Server and listen
const PORT = process.env.PORT || 3001;
// Database Connection and Server Startup
db.sequelize
    .authenticate()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server runnning on port ${PORT}`);
    });
})
    .catch((e) => {
    console.log(' \n\nDATABASE CONNECTION ERROR 💥🚨!!\n\n');
    console.log(e);
    process.exit(1);
});
