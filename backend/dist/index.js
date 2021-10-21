"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlinkFile = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var apiErrorHandler_1 = __importDefault(require("./middleware/apiErrorHandler"));
var initParse_1 = __importDefault(require("./utils/initParse"));
var authRoutes_1 = __importDefault(require("./routes/authRoutes"));
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
var postRoutes_1 = __importDefault(require("./routes/postRoutes"));
var FileUploadMiddleware_1 = require("./middleware/FileUploadMiddleware");
exports.unlinkFile = util_1.default.promisify(fs_1.default.unlink);
var app = express_1.default();
app.use(cors_1.default());
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/groups', groupRoutes_1.default);
app.use('/api/v1/posts', postRoutes_1.default);
// Loading All Image Request From AWS S3 and pipe it to client
app.get('/api/v1/image/:key', function (req, res) {
    var key = req.params.key;
    var readStream = FileUploadMiddleware_1.getFileStream(key);
    readStream.pipe(res);
});
app.use(apiErrorHandler_1.default);
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    initParse_1.default();
    console.log("Server runnning on port " + PORT);
});
