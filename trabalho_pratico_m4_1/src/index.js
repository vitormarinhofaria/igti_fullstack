import mongoose from "mongoose";
import express from "express";
import { AccountRouter } from "./routes/routes.js";

const APP_PORT = 3550;

const app = express();
app.use(express.json());

app.use("/account", AccountRouter);

mongoose.connect("mongodb+srv://vitor:echelon241@vitoratlas.9rkec.gcp.mongodb.net/igtiFullstack?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => console.log("Conectado")).catch((e) => console.log(e));

app.listen(APP_PORT, () => {
    console.log(`Servidor escutando na porta: ${APP_PORT}`);
})