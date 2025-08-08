import { google } from "googleapis";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Load service account credentials
const credentialsPath = path.join(process.cwd(), "service-account.json");
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

// Google Drive Auth
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

export async function POST(req) {
  return new Promise((resolve) => {
    const form = formidable({ multiples: true });

    // Parse incoming form-data
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("❌ Formidable error:", err);
        return resolve(
          new Response(JSON.stringify({ error: "File parsing failed" }), { status: 500 })
        );
      }

      try {
        const folderId = process.env.GDRIVE_FOLDER_ID || "";
        const uploadedFiles = [];

        for (const key in files) {
          const fileData = Array.isArray(files[key]) ? files[key][0] : files[key];
          if (!fileData) continue;

          const fileMetadata = {
            name: fileData.originalFilename || "untitled",
            parents: folderId ? [folderId] : undefined,
          };

          const media = {
            mimeType: fileData.mimetype || "application/octet-stream",
            body: fs.createReadStream(fileData.filepath),
          };

          const driveRes = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: "id, webViewLink, webContentLink",
          });

          uploadedFiles.push(driveRes.data);
        }

        resolve(
          new Response(JSON.stringify({ files: uploadedFiles }), { status: 200 })
        );
      } catch (uploadErr) {
        console.error("🚨 Upload to Google Drive failed:", uploadErr);
        resolve(new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 }));
      }
    });
  });
}
