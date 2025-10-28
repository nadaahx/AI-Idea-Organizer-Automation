// Extract and parse the JSON from the response
const response = $input.first().json;

// Get the JSON string from the message content
const content = response.body.choices[0].message.content;

// Extract JSON from the code block (remove ```json and ```)
const jsonString = content.replace(/```json\n?|\n?```/g, '').trim();

// Parse the JSON
const thoughtData = JSON.parse(jsonString);

// Extract ONLY the original user thought from the reasoning text
const reasoningText = $input.first().json.body.choices[0].message.reasoning_details[0].text;

// Extract the quoted user thought more precisely
let originalThought;
const quoteMatch = reasoningText.match(/user says: "([^"]+)"/i);
if (quoteMatch) {
    originalThought = quoteMatch[1]; // Gets only what's inside the quotes after "user says:"
} else {
    // Fallback: look for any quoted text in the reasoning
    const fallbackMatch = reasoningText.match(/"([^"]+)"/);
    originalThought = fallbackMatch ? fallbackMatch[1] : "Unknown thought";
}

// Remove "Architect this thought: " prefix if it exists
originalThought = originalThought.replace(/^Architect this thought:\s*/i, '');

// Create separated output
const result = {
    original_thought: originalThought,
    metadata: {
        ...thoughtData,
        timestamp: new Date().toISOString()
    }
};

return [result];
