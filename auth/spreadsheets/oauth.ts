"use server"; //①

import { JWT } from "google-auth-library";//②
import { GoogleSpreadsheet } from "google-spreadsheet";

export async function sendInquiry(data: FormData) {//③
 "use server"; //①

 const SCOPES = [
   "https://www.googleapis.com/auth/spreadsheets",
   "https://www.googleapis.com/auth/drive.file",
 ];
 const sheetId = process.env.SHEET_ID;
 const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
 const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, "\n");

 const jwt = new JWT({ //②
   email: clientEmail,
   key: privateKey,
   scopes: SCOPES,
 });

 // envファイルからの読み込みが問題ないかバリデーション
 if (
   typeof sheetId === "undefined" ||
   typeof clientEmail === "undefined" ||
   typeof privateKey === "undefined"
 ) {
   console.error(
     'env "SHEET_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY" are required.',
   );
   process.exit(1);
 }

 const doc = new GoogleSpreadsheet(sheetId, jwt)
};