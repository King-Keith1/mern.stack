require('dotenv').config();
mongoose.connect(process.env.MONGO_URL, {});
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());