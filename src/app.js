import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"
import restaurantRouter from "./routes/restaurant.routes.js"
import cors from "cors";
import { ErrorMiddleware } from "./middleware/error.middleware.js";

const app = express();


//Using middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({ 
        origin : [process.env.FRONTEND_URL],
        methods : ["GET", "POST", "PUT", "DELETE"],
        credentials : true
    })
);



//Using Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/restaurant", restaurantRouter);


app.use(ErrorMiddleware);
export default app;