'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useNotesStore } from '@/store/notes';
import type { Note } from '@/lib/types';
import { Loader2, Trash2 } from 'lucide-react';
import TagInput from './tag-input';
import { useSettingsStore } from '@/store/settings';
// AI summarization removed - using simple text excerpt
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
  color: z.string().optional(),
  tags: z.array(z.string()).default([]),
  colSpan: z.number().min(1).max(3).optional(),
  rowSpan: z.number().min(1).max(3).optional(),
});

const colors = ['#6366f1', '#ec4899', '#22c55e', '#f97316', '#06b6d4'];

export default function NoteEditor() {
  const { isEditorOpen, setIsEditorOpen, currentNote, setCurrentNote } = useNotesStore();
  const defaultNoteColor = useSettingsStore((state) => state.defaultNoteColor);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const user = auth.currentUser;

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      color: colors[0],
      tags: [],
      colSpan: 1,
      rowSpan: 1,
    },
  });

  useEffect(() => {
    if (currentNote) {
      form.reset({
        title: currentNote.title,
        content: currentNote.content,
        color: currentNote.color || colors[0],
        tags: currentNote.tags || [],
        colSpan: currentNote.colSpan || 1,
        rowSpan: currentNote.rowSpan || 1,
      });
    } else {
      form.reset({
        title: '',
        content: '',
        color: defaultNoteColor,
        tags: [],
        colSpan: 1,
        rowSpan: 1,
      });
    }
  }, [currentNote, form, isEditorOpen, defaultNoteColor]);

  const handleClose = () => {
    if (isSaving || isDeleting) return;
    setIsEditorOpen(false);
    setCurrentNote(null);
  }

  const onSubmit = async (values: z.infer<typeof noteSchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not authenticated' });
      return;
    }
    setIsSaving(true);
    try {
      // Generate simple excerpt from content (no AI needed)
      let excerpt = '';
      if (values.content) {
        excerpt = values.content.substring(0, 150) + (values.content.length > 150 ? '...' : '');
      }

      const noteData: Omit<Note, 'id' | 'createdAt'> = {
        ...values,
        excerpt,
        updatedAt: serverTimestamp(),
        userId: user.uid,
        isDeleted: false,
      };

      if (currentNote) {
        const noteRef = doc(db, `users/${user.uid}/notes`, currentNote.id);
        await updateDoc(noteRef, noteData);
        toast({ title: 'Note updated successfully' });
      } else {
        await addDoc(collection(db, `users/${user.uid}/notes`), {
          ...noteData,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Note created successfully' });
      }
      handleClose();
    } catch (error) {
      console.error('Error saving note: ', error);
      toast({ variant: 'destructive', title: 'Error saving note' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !currentNote) return;
    setIsDeleting(true);
    try {
      const noteRef = doc(db, `users/${user.uid}/notes`, currentNote.id);
      await updateDoc(noteRef, { isDeleted: true, updatedAt: serverTimestamp() });
      toast({ title: "Note moved to trash" });
      handleClose();
    } catch (error) {
      console.error("Error deleting note: ", error);
      toast({ variant: "destructive", title: "Error deleting note" });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={isEditorOpen} onOpenChange={handleClose}>
      <DialogContent className="border-white/10 bg-background/80 backdrop-blur-xl sm:max-w-[625px] max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Note Title"
                          className="border-0 bg-transparent p-0 text-2xl font-bold text-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your note here..."
                        className="min-h-[250px] resize-none border-white/10 bg-white/5 font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {colors.map(color => (
                          <button key={color} type="button" onClick={() => field.onChange(color)} className={`h-8 w-8 rounded-full border-2 transition-all ${field.value === color ? 'border-primary' : 'border-transparent'}`}>
                            <div className="h-full w-full rounded-full" style={{ backgroundColor: color }}></div>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Tags</FormLabel>
                    <FormControl>
                      <TagInput
                        tags={field.value}
                        onChange={field.onChange}
                        placeholder="Add tags (press Enter)"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colSpan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400">Note Size</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Small', col: 1, row: 1 },
                          { label: 'Wide', col: 2, row: 1 },
                          { label: 'Tall', col: 1, row: 2 },
                          { label: 'Large', col: 2, row: 2 },
                        ].map((size) => (
                          <button
                            key={size.label}
                            type="button"
                            onClick={() => {
                              field.onChange(size.col);
                              form.setValue('rowSpan', size.row);
                            }}
                            className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${field.value === size.col && form.getValues('rowSpan') === size.row
                              ? 'border-indigo-500 bg-indigo-500/10'
                              : 'border-white/10 hover:border-white/20'
                              }`}
                          >
                            <div
                              className="rounded bg-indigo-500/30"
                              style={{
                                width: size.col * 20,
                                height: size.row * 20,
                              }}
                            />
                            <span className="text-xs text-zinc-400">{size.label}</span>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="sm:justify-between">
              <div>
                {currentNote && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" type="button" disabled={isSaving || isDeleting}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will move the note to the trash.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <Button type="submit" disabled={isSaving || isDeleting}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentNote ? 'Save Changes' : 'Create Note'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
