'use client'
import { useState, useEffect } from 'react'
import { defaultFolders } from '@/data/folders'
import PinnedNotes from './PinnedNotes'

export default function NoteList({ notes: initialNotes, currentFolder }) {
  // Get saved notes from localStorage or use initial notes
  const [notes, setNotes] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedNotes = localStorage.getItem('notes')
      return savedNotes ? JSON.parse(savedNotes) : initialNotes
    }
    return initialNotes
  })

  const [isCreatingNote, setIsCreatingNote] = useState(false)
  const [newNote, setNewNote] = useState({
    title: '',
    content: ''
  })
  const [selectedNote, setSelectedNote] = useState(null)

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Update handleSaveNote to actually save the note
  const handleSaveNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const note = {
        id: Date.now().toString(), // Generate unique ID
        ...newNote,
        date: new Date().toISOString(),
        folderId: currentFolder,
        isPinned: false,
        snippet: newNote.content.slice(0, 100) // Create snippet from content
      }

      setNotes(prevNotes => [...prevNotes, note])
      setIsCreatingNote(false)
      setNewNote({ title: '', content: '' })
    }
  }

  // Get current folder info
  const currentFolderInfo = defaultFolders.find(f => f.id === currentFolder) || {
    id: currentFolder,
    // If it's not a default folder, use the folder name from localStorage
    name: localStorage.getItem('folders') 
      ? JSON.parse(localStorage.getItem('folders')).find(f => f.id === currentFolder)?.name || 'Untitled'
      : currentFolder,
    icon: '📁'
  }

  // Add this useEffect to ensure we have the folder data
  useEffect(() => {
    const savedFolders = localStorage.getItem('folders')
    if (!savedFolders) {
      localStorage.setItem('folders', JSON.stringify([]))
    }
  }, [])

  // Filter notes based on current folder
  const folderNotes = currentFolder === 'all' 
    ? notes 
    : notes?.filter(note => note.folderId === currentFolder) || []

  // Get pinned notes for current folder
  const pinnedNotes = folderNotes.filter(note => note.isPinned)
  
  // Get unpinned notes for current folder
  const unpinnedNotes = folderNotes.filter(note => !note.isPinned)

  const handleTogglePin = (noteId) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === noteId 
        ? { ...note, isPinned: !note.isPinned }
        : note
    ))
  }

  const NoteCard = ({ note }) => (
    <div className="p-4 bg-white rounded-lg border border-[#e9e8f8] hover:shadow-md transition-all group">
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-[#594d8c]">{note.title}</h3>
        <button 
          onClick={() => handleTogglePin(note.id)}
          className="text-[#a69ed9] hover:text-[#7b6eac] transition-colors"
        >
          {note.isPinned ? '' : '📌'}
        </button>
      </div>
      <p className="text-sm text-[#594d8c] mt-2 line-clamp-2">{note.snippet}</p>
      <time className="text-xs text-[#a69ed9] mt-2 block">
        {new Date(note.date).toLocaleDateString()}
      </time>
    </div>
  )

  const handleCreateNote = () => {
    setIsCreatingNote(true)
  }

  const NoteListItem = ({ note }) => (
    <div 
      onClick={() => setSelectedNote(note)}
      className={`flex items-start p-4 hover:bg-[#f8f7fd] border-b border-[#e9e8f8] cursor-pointer group transition-colors ${
        selectedNote?.id === note.id ? 'bg-[#f8f7fd]' : ''
      }`}
    >
      <div className="w-64 pr-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[#594d8c] truncate">{note.title}</h3>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              handleTogglePin(note.id)
            }}
            className="text-[#a69ed9] hover:text-[#7b6eac] transition-colors opacity-0 group-hover:opacity-100"
          >
            {note.isPinned ? '📌' : ''}
          </button>
        </div>
        <time className="text-xs text-[#a69ed9] block mt-1">
          {new Date(note.date).toLocaleDateString()}
        </time>
      </div>
    </div>
  )

  useEffect(() => {
    // Set first note as selected when notes change
    if (folderNotes.length && !selectedNote) {
      setSelectedNote(folderNotes[0])
    }
  }, [folderNotes])

  return (
    <div className="flex flex-1 border-r border-[#e9e8f8]">
      {/* Notes List - Left Side */}
      <div className="w-80 border-r border-[#e9e8f8] overflow-y-auto">
        <header className="flex items-center justify-between p-4 border-b border-[#e9e8f8] relative">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentFolderInfo.icon}</span>
            <h1 className="text-xl font-semibold text-[#594d8c] truncate">
              {currentFolderInfo.name}
            </h1>
          </div>
          <button 
            onClick={handleCreateNote}
            className="w-8 h-8 flex items-center justify-center bg-[#7b6eac] hover:bg-[#6a5d9b] text-white rounded-lg transition-all duration-200 relative group shadow-sm"
          >
            <span className="text-xl">+</span>
            {/* Updated Tooltip */}
            <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200" 
                 style={{ top: 'calc(100% + 0.5rem)', zIndex: 50 }}>
              {/* Arrow */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-2 h-2 bg-[#594d8c] rotate-45"></div>
              {/* Tooltip content */}
              <div className="bg-[#594d8c] text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg">
                New Note
              </div>
            </div>
          </button>
        </header>

        {pinnedNotes.length > 0 && (
          <>
            <div className="py-2 px-4 bg-[#f8f7fd] text-xs text-[#7b6eac]">
              Pinned
            </div>
            {pinnedNotes.map(note => (
              <NoteListItem key={note.id} note={note} />
            ))}
          </>
        )}

        {unpinnedNotes.length > 0 && (
          <>
            <div className="py-2 px-4 bg-[#f8f7fd] text-xs text-[#7b6eac]">
              Notes
            </div>
            {unpinnedNotes.map(note => (
              <NoteListItem key={note.id} note={note} />
            ))}
          </>
        )}
      </div>

      {/* Note Content - Right Side with adjusted padding */}
      <div className="flex-1 bg-white pr-20"> {/* Added pr-20 here */}
        {isCreatingNote ? (
          <div className="h-full relative"> {/* Added relative positioning */}
            <div className="p-6">
              <input
                type="text"
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full text-xl font-medium text-[#594d8c] placeholder-[#a69ed9] bg-transparent focus:outline-none"
              />
              <textarea
                placeholder="Start writing..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full h-[calc(100vh-200px)] mt-4 text-[#594d8c] placeholder-[#a69ed9] bg-transparent focus:outline-none resize-none"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[#e9e8f8]">
              {/* Changed from fixed to absolute and adjusted width */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsCreatingNote(false)}
                  className="px-4 py-2 text-[#594d8c] hover:bg-[#f8f7fd] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-[#7b6eac] hover:bg-[#6a5d9b] text-white rounded-lg transition-colors shadow-sm"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        ) : selectedNote ? (
          <div className="p-6">
            <h1 className="text-xl font-medium text-[#594d8c]">{selectedNote.title}</h1>
            <div className="mt-4 text-[#594d8c]">
              {selectedNote.content}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-[#a69ed9]">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  )
}