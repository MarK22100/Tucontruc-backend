import express from "express";
import "dotenv/config";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API TuContruc funcionando");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});