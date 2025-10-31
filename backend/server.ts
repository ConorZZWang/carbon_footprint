import express,{Request, Response} from "express";
import cors from "cors";
import { Parser } from './src/Parser/Parser'
import { calculatorData } from './src/Parser/CalculatorADT';
import puppeteer from "puppeteer";
import fs from "fs"; 
import { connectToDatabase, getDatabase } from './db';

const app = express();
app.use(cors());
app.use(express.json());
const testData: calculatorData = Parser.parseAllCalculatorData();
console.log(testData);

// MongoDB connection
connectToDatabase();

app.get("/api/calculator-data", async (req, res) => {
    try {
        res.json(testData);
    } catch (error) {
        console.error("Error loading calculator data:", error);
        res.status(500).json({ error: "Failed to load calculator data" });
    }
});

// API to save calculator state
app.post("/api/saveState", async (req, res) => {
    try {
        await connectToDatabase();
        const db = getDatabase();
        const collection = db.collection("calculatorState");

        const state = req.body;  // Get state from request body
        const result = await collection.insertOne(state);
        
        res.json({ message: "State saved successfully", id: result.insertedId });
    } catch (error) {
        console.error("Error saving state:", error);
        res.status(500).json({ error: "Failed to save state" });
    }
});

//used for the PDF 
app.get("/generate-pdf", async (req: Request, res: Response) => {
    try {
        const browser = await puppeteer.launch({ headless: true  });
        const page = await browser.newPage();

        // Example HTML content (Modify as needed)
        const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: blue; }
                </style>
            </head>
            <body>
                <h1>Exported PDF</h1>
                <p>This is dynamically generated content from the server.</p>
            </body>
            </html>
        `;

        await page.setContent(htmlContent);
        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        // Save the PDF file locally for inspection TEST 
        const pdfFilePath = "exported.pdf"; // Local file path for inspection
        fs.writeFileSync(pdfFilePath, pdfBuffer);
        console.log(`PDF saved locally as '${pdfFilePath}'`);

        // Set headers for automatic download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=exported.pdf");
        res.contentType("application/pdf");
        res.end(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("Error generating PDF");
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});