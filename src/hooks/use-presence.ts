'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export type UserPresence = {
    userId: string;
    userName: string;
    userAvatar: string;
    lastSeen: Date;
};

/**
 * Hook for Firestore-based presence tracking
 * @param noteId - ID of the note being viewed
 * @returns Array of active users
 */
export function usePresence(noteId: string | null): UserPresence[] {
    const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
    const user = auth.currentUser;

    useEffect(() => {
        if (!noteId || !user) return;

        const presenceRef = doc(db, `users/${user.uid}/presence/${noteId}`);

        // Write our presence
        const writePresence = async () => {
            try {
                await setDoc(presenceRef, {
                    userId: user.uid,
                    userName: user.displayName || 'Anonymous',
                    userAvatar: user.photoURL || '',
                    lastSeen: serverTimestamp(),
                });
            } catch (error) {
                console.error('Error writing presence:', error);
            }
        };

        writePresence();

        // Update presence every 30 seconds
        const interval = setInterval(writePresence, 30000);

        // Listen for other users' presence (in a real implementation,
        // you'd query all users' presence for this noteId)
        // For now, we'll just track our own presence
        const unsubscribe = onSnapshot(presenceRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const lastSeen = data.lastSeen?.toDate() || new Date();
                const now = new Date();
                const isActive = (now.getTime() - lastSeen.getTime()) < 120000; // 2 minutes

                if (isActive) {
                    setActiveUsers([{
                        userId: data.userId,
                        userName: data.userName,
                        userAvatar: data.userAvatar,
                        lastSeen
                    }]);
                } else {
                    setActiveUsers([]);
                }
            }
        });

        // Cleanup
        return () => {
            clearInterval(interval);
            unsubscribe();
            // Optionally: delete presence document on unmount
        };
    }, [noteId, user]);

    return activeUsers;
}
