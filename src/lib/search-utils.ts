import Fuse from 'fuse.js';
import type { Note } from './types';

/**
 * Perform fuzzy search on notes
 * @param notes - Array of notes to search
 * @param query - Search query
 * @returns Search results with scores
 */
export function fuzzySearchNotes(notes: Note[], query: string): Note[] {
    if (!query || query.trim().length === 0) return [];

    const fuse = new Fuse(notes, {
        keys: [
            { name: 'title', weight: 0.4 },
            { name: 'content', weight: 0.3 },
            { name: 'tags', weight: 0.2 },
            { name: 'keywords', weight: 0.1 }
        ],
        threshold: 0.4, // 0 = exact match, 1 = match anything
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
    });

    const results = fuse.search(query);

    // Return notes sorted by relevance score
    return results.map(result => result.item);
}

/**
 * Simple direct text search (for exact matches)
 * @param notes - Array of notes
 * @param query - Search query
 * @returns Matching notes
 */
export function directSearchNotes(notes: Note[], query: string): Note[] {
    if (!query || query.trim().length === 0) return notes;

    const lowerQuery = query.toLowerCase().trim();

    return notes.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(lowerQuery);
        const contentMatch = note.content.toLowerCase().includes(lowerQuery);
        const tagsMatch = note.tags?.some(tag =>
            tag.toLowerCase().includes(lowerQuery)
        );
        const keywordsMatch = note.keywords?.some(keyword =>
            keyword.toLowerCase().includes(lowerQuery)
        );

        return titleMatch || contentMatch || tagsMatch || keywordsMatch;
    });
}
