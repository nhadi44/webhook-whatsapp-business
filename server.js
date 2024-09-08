const express = require('express')
const app = express()

const port = 5000

// Middleware untuk parsing JSON body
app.use(express.json());

app.get("/" , (req, res) =>{
    res.status(200).json({
        message: "Hello World"
    })
})


app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});