import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

// Expose static files from the React app dist folder (for production build)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/excel-data', async (req, res) => {
  try {
    // 1. Try Method A (Azure AD Client Credentials + Microsoft Graph API)
    if (process.env.AZURE_TENANT_ID && process.env.AZURE_CLIENT_ID && process.env.AZURE_CLIENT_SECRET) {
      try {
        console.log("Attempting SharePoint fetch using Azure AD Client Credentials...");
        const tokenUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`;
        const params = new URLSearchParams();
        params.append('client_id', process.env.AZURE_CLIENT_ID);
        params.append('scope', 'https://graph.microsoft.com/.default');
        params.append('client_secret', process.env.AZURE_CLIENT_SECRET);
        params.append('grant_type', 'client_credentials');

        const tokenRes = await fetch(tokenUrl, {
          method: 'POST',
          body: params,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!tokenRes.ok) {
          throw new Error(`Token request failed with status ${tokenRes.status}`);
        }

        const tokenData = await tokenRes.json();
        const token = tokenData.access_token;

        const graphUrl = `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/drive/root:${process.env.SHAREPOINT_FILE_PATH}:/content`;
        const fileRes = await fetch(graphUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (fileRes.ok) {
          console.log("Successfully fetched live data using Azure AD.");
          const buffer = await fileRes.arrayBuffer();
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          return res.send(Buffer.from(buffer));
        } else {
          throw new Error(`Graph API returned status ${fileRes.status}`);
        }
      } catch (err) {
        console.warn("Method A (Azure AD App Registration) failed:", err.message);
      }
    }

    // 2. Try Method B (Session Cookie proxy)
    if (process.env.SHAREPOINT_COOKIE) {
      try {
        console.log("Attempting SharePoint fetch using Session Cookie...");
        const downloadUrl = "https://microgenesistechsoft.sharepoint.com/sites/Global-MarketSales/_layouts/15/download.aspx?sourcedoc=%7B6D3A78BD-FAA9-410E-80F2-AE2580A9187A%7D";
        const fileRes = await fetch(downloadUrl, {
          headers: {
            "Cookie": process.env.SHAREPOINT_COOKIE,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        });

        if (fileRes.ok) {
          console.log("Successfully fetched live data using SharePoint Cookie.");
          const buffer = await fileRes.arrayBuffer();
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          return res.send(Buffer.from(buffer));
        } else {
          throw new Error(`SharePoint download returned status ${fileRes.status}`);
        }
      } catch (err) {
        console.warn("Method B (SharePoint Session Cookie) failed:", err.message);
      }
    }

    // 3. Fallback: Serve local file
    console.log("Both live fetch methods failed or were not configured. Serving local fallback Excel file...");
    const localFilePath = path.join(__dirname, 'public', 'data', 'MIS.xlsx');
    if (fs.existsSync(localFilePath)) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.sendFile(localFilePath);
    }

    const localFilePath2 = path.join(__dirname, 'public', 'data', 'MIS 2.xlsx');
    if (fs.existsSync(localFilePath2)) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.sendFile(localFilePath2);
    }

    res.status(404).send("Excel file not found locally and live sync failed.");
  } catch (err) {
    console.error("Critical error in backend server:", err);
    res.status(500).send("Internal Server Error");
  }
});

// React Router fallback (serve index.html for all other routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
