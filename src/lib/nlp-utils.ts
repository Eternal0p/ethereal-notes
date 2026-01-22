import nlp from 'compromise';

/**
 * Extract keywords from note content using NLP
 * @param text - Plain text content
 * @returns Array of keywords (nouns and verbs)
 */
export function extractKeywords(text: string): string[] {
    if (!text || text.length < 10) return [];

    const doc = nlp(text);

    // Extract nouns and important verbs
    const nouns = doc.nouns().out('array');
    const verbs = doc.verbs().out('array');

    // Combine and deduplicate
    const keywords = [...new Set([...nouns, ...verbs])]
        .filter(word => word.length > 3) // Filter out short words
        .slice(0, 15); // Limit to 15 keywords

    return keywords;
}

/**
 * Generate extractive summary (first 2 meaningful sentences)
 * @param text - Plain text or HTML content
 * @returns Summary string
 */
export function generateSummary(text: string): string {
    if (!text || text.length < 20) return text;

    // Strip HTML tags if present
    const plainText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    const doc = nlp(plainText);
    const sentences = doc.sentences().out('array');

    if (sentences.length === 0) return plainText.substring(0, 150);

    // Return first 2 sentences, or first sentence if only one exists
    const summary = sentences.slice(0, 2).join(' ');

    return summary.length > 200 ? summary.substring(0, 200) + '...' : summary;
}

/**
 * Structure voice input into formatted note content
 * @param transcript - Raw voice transcript
 * @returns Structured content with title, headers, bullets, action items
 */
export function structureVoiceInput(transcript: string): {
    title: string;
    headers: string[];
    bullets: string[];
    actionItems: string[];
} {
    const doc = nlp(transcript);

    // Extract title from first sentence
    const firstSentence = doc.sentences().first().text();
    const title = firstSentence.length > 50
        ? firstSentence.substring(0, 50) + '...'
        : firstSentence;

    // Find potential headers (capitalized phrases)
    const headers = doc
        .match('#TitleCase+')
        .out('array')
        .filter((h: string) => h.split(' ').length >= 2 && h.split(' ').length <= 5)
        .slice(0, 5);

    // Find list-like sentences (containing "and", "or", commas)
    const sentences = doc.sentences().out('array');
    const bullets = sentences
        .filter((s: string) => s.includes(',') || s.includes(' and ') || s.includes(' or '))
        .slice(0, 8);

    // Find action items (imperative phrases)
    const actionItems = doc
        .match('(need|should|must|have to|remember to) to? #Verb+')
        .out('array')
        .slice(0, 5);

    return {
        title,
        headers: headers.length > 0 ? headers : [],
        bullets: bullets.length > 0 ? bullets : sentences.slice(0, 5),
        actionItems: actionItems.length > 0 ? actionItems : []
    };
}

/**
 * Format structured voice input as HTML
 * @param structured - Structured voice data
 * @returns HTML string
 */
export function formatVoiceInputAsHTML(structured: {
    title: string;
    headers: string[];
    bullets: string[];
    actionItems: string[];
}): string {
    let html = '';

    // Add headers if present
    if (structured.headers.length > 0) {
        html += structured.headers.map(h => `<h2>${h}</h2>`).join('\n');
    }

    // Add bullets
    if (structured.bullets.length > 0) {
        html += '<ul>\n';
        html += structured.bullets.map(b => `<li>${b}</li>`).join('\n');
        html += '\n</ul>\n';
    }

    // Add action items if present
    if (structured.actionItems.length > 0) {
        html += '<h3>Action Items</h3>\n<ul>\n';
        html += structured.actionItems.map(a => `<li>${a}</li>`).join('\n');
        html += '\n</ul>';
    }

    return html;
}
