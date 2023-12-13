import express from "express";
import cors from "cors";
import users from "./routes/users.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", users);

//start the express server
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});