import express from "express";
import { GradesController } from "./routes.js";

const APP_PORT = 3550;

const app = express();
app.use(express.json());

app.use("/grades", GradesController);

app.listen(APP_PORT, () => {
    console.log(`Servidor escutando na porta ${APP_PORT}`);
})