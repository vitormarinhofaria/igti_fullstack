import { Application } from "https://deno.land/x/oak@v6.4.0/mod.ts";
import { GradesController } from "./GradesController.ts";

const app = new Application();

app.use(GradesController.routes());

await app.listen({ port: 3550 });
