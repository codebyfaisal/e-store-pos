import express from "express";
import { port, frontendUrl } from "./src/config/env.config.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { productRoutes, customerRouter, orderRouter, brandRouter, categoryRouter, salesReturnRouter, invoiceRouter, dashboardRouter, reportRouter, userRouter} from "./src/routes/index.js";
import arcjetMiddleware from "./src/middlewares/arcjet.middleware.js";
import initDb from "./src/initDb.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { authenticate } from "./src/middlewares/auth.middleware.js";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: frontendUrl, credentials: true,}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());

// app.use(arcjetMiddleware);

app.get("/", (req, res) => res.send("Ok 👍"));

app.use("/api/users", userRouter);
app.use("/api/dashboard", authenticate, dashboardRouter);
app.use("/api/products", authenticate, productRoutes);
app.use("/api/customers", authenticate, customerRouter);
app.use("/api/categories", authenticate, categoryRouter);
app.use("/api/brands", authenticate, brandRouter);
app.use("/api/orders", authenticate, orderRouter);
app.use("/api/sales-returns", authenticate, salesReturnRouter);
app.use("/api/invoices", authenticate, invoiceRouter);
app.use("/api/reports", authenticate, reportRouter);

initDb().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
  });
});
