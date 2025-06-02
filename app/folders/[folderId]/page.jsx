'use client'
import { useParams } from 'next/navigation'
import NoteList from '@/components/NoteList'

export default function FolderPage() {
  const params = useParams()
  const folderId = params.folderId

  // Dummy notes data - later replace with real data
  const notes = [
    {
      id: '1',
      title: 'Meeting Notes',
      snippet: 'Discussion points for the weekly team sync...',
      emoji: '📝',
      isPinned: true,
      date: new Date(),
      folderId: 'work'
    },
    {
      id: '2',
      title: 'Shopping List',
      snippet: 'Things to buy this weekend...',
      emoji: '🛒',
      isPinned: false,
      date: new Date(),
      folderId: 'personal'
    },
    // Add more dummy notes as needed
  ]

  return <NoteList notes={notes} currentFolder={folderId} />
}