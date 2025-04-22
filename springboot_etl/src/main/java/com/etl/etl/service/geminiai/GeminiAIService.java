package com.etl.etl.service.geminiai;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiAIService {

    private static final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBj2MyWr83jM9jlxgLJOJGKhLX0JvlLRVY";

    @SuppressWarnings("unchecked")
    public String getFixSuggestion(String issueDescription) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Creating the request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", new Object[]{
            Map.of("parts", new Object[]{
                Map.of("text", "How can I fix this issue: " + issueDescription + "? Provide a concise solution.")
            })
        });

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.exchange(
                API_URL, HttpMethod.POST, entity, Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return extractSuggestion(response.getBody());
            }
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return "Error fetching fix suggestion: " + e.getMessage();
        } catch (Exception e) {
            return "Unexpected error occurred.";
        }
        return "No suggestion found.";
    }

    private String extractSuggestion(Map<String, Object> responseBody) {
        if (responseBody.containsKey("candidates")) {
            Object candidatesObj = responseBody.get("candidates");
            if (candidatesObj instanceof Iterable<?> candidates) {
                for (Object candidate : candidates) {
                    if (candidate instanceof Map<?, ?> candidateMap && candidateMap.containsKey("content")) {
                        return candidateMap.get("content").toString();
                    }
                }
            }
        }
        return "No valid response from AI.";
    }
}
