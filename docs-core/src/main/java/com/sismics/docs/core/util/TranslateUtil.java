package com.sismics.docs.core.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class TranslateUtil {

    // The API URL endpoint for translation
    private static final String API_ENDPOINT = "https://api.mymemory.translated.net/get";

    /**
     * Translates the given text into the specified target language.
     * 
     * @param text       The text that needs to be translated
     * @param targetLang The target language code (e.g., "en" for English)
     * @return           The translated text
     * @throws Exception If there's an error during the translation process
     */
    public static String translate(String text, String targetLang) throws Exception {
        System.out.println("Starting translation for: " + text + " to " + targetLang);

        // Encode the text to make it URL-safe
        String encodedText = URLEncoder.encode(text, "UTF-8");

        // Create the complete URL with query parameters
        String requestUrl = API_ENDPOINT + "?q=" + encodedText + "&langpair=zh-cn|" + targetLang;
        System.out.println("Generated request URL: " + requestUrl);

        // Set up the connection to the translation API
        URL url = new URL(requestUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        // Read the response from the API
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("Response: " + line);
                response.append(line);
            }

            // Parse the translated text from the JSON response
            String jsonResponse = response.toString();
            int startIndex = jsonResponse.indexOf("\"translatedText\":\"") + 18;
            int endIndex = jsonResponse.indexOf("\"", startIndex);

            // Return the translated text
            return jsonResponse.substring(startIndex, endIndex);
        }
    }
}
