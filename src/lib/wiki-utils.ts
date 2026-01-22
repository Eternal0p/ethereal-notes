import nlp from 'compromise';

/**
 * Extract wiki-link note IDs from HTML content
 * Looks for mention nodes with data-id attributes
 */
export function extractWikiLinks(html: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mentionNodes = doc.querySelectorAll('[data-type="mention"]');

    const linkedIds: string[] = [];
    mentionNodes.forEach(node => {
        const id = node.getAttribute('data-id');
        if (id) {
            linkedIds.push(id);
        }
    });

    return Array.from(new Set(linkedIds)); // Remove duplicates
}

/**
 * Extract key sentences and topics from text using NLP
 * Returns a summary and keywords
 */
export function generateSummary(text: string): { summary: string; keywords: string[] } {
    if (!text || text.trim().length === 0) {
        return { summary: '', keywords: [] };
    }

    // Parse text with compromise
    const doc = nlp(text);

    // Extract sentences
    const sentences = doc.sentences().out('array') as string[];

    // If text is short, just return it
    if (sentences.length <= 3) {
        return {
            summary: text,
            keywords: extractKeywords(text),
        };
    }

    // Score sentences by importance (length, position, entities)
    const scoredSentences = sentences.map((sentence, index) => {
        let score = 0;

        // First and last sentences are usually important
        if (index === 0) score += 3;
        if (index === sentences.length - 1) score += 2;

        // Longer sentences often contain more information
        score += sentence.split(' ').length / 10;

        // Sentences with entities (people, places, organizations) are important
        const sentDoc = nlp(sentence);
        score += sentDoc.people().out('array').length * 2;
        score += sentDoc.places().out('array').length * 1.5;
        score += sentDoc.organizations().out('array').length * 1.5;

        // Sentences with numbers/dates can be important
        score += sentDoc.numbers().out('array').length * 0.5;
        score += sentDoc.dates().out('array').length * 0.5;

        return { sentence, score, index };
    });

    // Sort by score and take top 3-5 sentences
    const topSentences = scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(5, Math.ceil(sentences.length * 0.3)))
        .sort((a, b) => a.index - b.index) // Restore original order
        .map(item => item.sentence);

    const summary = topSentences.join(' ');
    const keywords = extractKeywords(text);

    return { summary, keywords };
}

/**
 * Extract important keywords and topics from text
 */
export function extractKeywords(text: string): string[] {
    const doc = nlp(text);

    const keywords: string[] = [];

    // Extract named entities
    keywords.push(...doc.people().out('array'));
    keywords.push(...doc.places().out('array'));
    keywords.push(...doc.organizations().out('array'));
    keywords.push(...doc.topics().out('array'));

    // Extract important nouns (excluding common words)
    const nouns = doc.nouns().out('array');
    const commonWords = new Set(['thing', 'time', 'person', 'way', 'day', 'man', 'year', 'work', 'part', 'place']);

    nouns.forEach(noun => {
        if (!commonWords.has(noun.toLowerCase()) && noun.length > 3) {
            keywords.push(noun);
        }
    });

    // Remove duplicates and take top 10
    const uniqueKeywords = Array.from(new Set(keywords.map(k => k.toLowerCase())));
    return uniqueKeywords.slice(0, 10);
}
