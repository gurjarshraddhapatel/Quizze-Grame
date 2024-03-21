const app = require("./app")
const connectDB = require('./database/database')


PORT=4000

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is working on http://localhost:${PORT}`)
})