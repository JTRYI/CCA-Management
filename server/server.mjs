import express from "express";
import cors from "cors";
import users from "./routes/users.mjs";
import announcements from "./routes/announcements.mjs"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

app.use("/", users);
app.use(announcements);

//start the express server
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});