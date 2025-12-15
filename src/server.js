import express from "express";
import "dotenv/config";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import stockRoutes from "./routes/stock.routes.js"
import materialRoutes from "./routes/material.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/stock", stockRoutes);

app.get("/", (req, res) => {
  res.send("API TuContruc funcionando");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});