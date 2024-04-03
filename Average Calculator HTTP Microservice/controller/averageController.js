const axios = require('axios');

const WINDOW_SIZE = 10;
let numberQueue = [];

// Fetch numbers from the test server
const fetchNumbers = async (qualifier) => {
    try {
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTYwNjQ1LCJpYXQiOjE3MTIxNjAzNDUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjEyOTUxZWNlLWU0M2MtNGVhMC04NmM5LWI2YjIzYmViNzYzOCIsInN1YiI6ImRlYm9qeW90aV9kZWJhc2lzaEBzcm1hcC5lZHUuaW4ifSwiY29tcGFueU5hbWUiOiJTUk0gVW5pdmVyc2l0eSBBUCIsImNsaWVudElEIjoiMTI5NTFlY2UtZTQzYy00ZWEwLTg2YzktYjZiMjNiZWI3NjM4IiwiY2xpZW50U2VjcmV0IjoiR2RqRmJiQUFtdmNnbURrbCIsIm93bmVyTmFtZSI6IkRlYm9qeW90aSBDaGFuZGEiLCJvd25lckVtYWlsIjoiZGVib2p5b3RpX2RlYmFzaXNoQHNybWFwLmVkdS5pbiIsInJvbGxObyI6IkFQMjExMTAwMTExMzgifQ.7wy26OPgAVYtPe5WSnupXZi8gnWJ00S6CeT1UGHB9-4`;

        let type;
        if (qualifier === "p") {
            type = "primes";
        } else if (qualifier === "e") {
            type = "even";
        } else if (qualifier === "f") {
            type = "fibo";
        } else if (qualifier === "r") {
            type = "rand";
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.get(`http://20.244.56.144/test/${type}`, config);
        return response.data.numbers;
    } catch (error) {
        throw new Error("Error fetching numbers from the test server");
    }
};


// Calculate average of numbers
const calculateAverage = (numbers) => {
    if (!numbers || numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

// Process incoming request
const processRequest = async (req, res, next) => {
    // Qualified IDs include 'p' for prime, 'f' for Fibonacci, 'e' for even, and 'r' for random numbers.
    const qualifier = req.params.qualifier;

    try {
        const startTime = Date.now();
        const fetchedNumbers = await fetchNumbers(qualifier);
        const endTime = Date.now();

        if (!fetchedNumbers || fetchedNumbers.length === 0) {
            throw new Error("Failed to fetch numbers from the test server");
        }

        // Update number queue
        numberQueue = [...numberQueue, ...fetchedNumbers].slice(-WINDOW_SIZE);

        const response = {
            numbers: fetchedNumbers,
            windowPrevState: numberQueue.slice(0, -fetchedNumbers.length),
            windowCurrState: numberQueue,
            avg: calculateAverage(numberQueue)
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    processRequest
};



