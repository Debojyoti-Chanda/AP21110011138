const express = require('express');

const averageRoutes = require('./routes/averageRoutes');

const app = express();

app.use(express.json());

app.use('/', averageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
