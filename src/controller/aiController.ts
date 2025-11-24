import { GoogleGenAI } from "@google/genai";
import {Response, Request} from "express";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

export const generateText = async (req:Request, res:Response) => {
    try {
        const { text, maxToken } = req.body;

        const apiResponse = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            {
                contents: [
                    {
                        parts: [{ text }]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: maxToken || 150
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": "AIzaSyCkd5i-RegilfYmt0cbHjA0D0Yie4LPEzg",
                }
            }
        )

        const genratedContent =
            apiResponse.data?.candidates?.[0]?.content?.[0]?.text ||
            apiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No data"

        res.status(200).json({
            message: "Text generated successfully.",
            data: genratedContent,
        });

    } catch (err) {
        console.error("Gemini API Error:", err);

        res.status(500).json({
            message: "Internal server error while generating text!",
        });
    }
}