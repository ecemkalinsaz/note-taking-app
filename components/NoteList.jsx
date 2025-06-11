'use client'
import { useState, useEffect } from 'react'
import { defaultFolders } from '@/data/folders'
import NoteDetails from './NoteDetails'

export default function NoteList({ notes: initialNotes, currentFolder }) {
  const [notes, setNotes] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedNotes = localStorage.getItem('notes')
      return savedNotes ? JSON.parse(savedNotes) : initialNotes
    }
    return initialNotes
  })
  const [selectedNote, setSelectedNote] = useState(null)
  const [isCreatingNote, setIsCreatingNote] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Update handleSaveNote to actually save the note
  const handleSaveNote = (noteData) => {
    const note = {
      id: Date.now().toString(), // Generate unique ID
      ...noteData,
      date: new Date().toISOString(),
      folderId: currentFolder,
      isPinned: false,
      snippet: noteData.content.slice(0, 100) // Create snippet from content
    }

    setNotes(prevNotes => [...prevNotes, note])
    setIsCreatingNote(false)
    setNewNote({ title: '', content: '' })
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

  const handleDeleteNote = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
    if (selectedNote?.id === noteId) {
      setSelectedNote(null)
    }
  }

  const NoteCard = ({ note }) => (
    <div className="p-4 bg-white rounded-lg border border-[#e9e8f8] hover:shadow-md transitio-nall group">
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-[#594d8c]">{note.title}</h3>z
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

  const handleUpdateNote = (noteData) => {
    setNotes(prevNotes => prevNotes.map(note => 
      note.id === noteData.id 
        ? {
            ...note,
            ...noteData,
            date: new Date().toISOString(),
            snippet: noteData.content.slice(0, 100)
          }
        : note
    ))
    setIsEditing(false)
    setSelectedNote(prevNote => ({
      ...prevNote,
      ...noteData,
      date: new Date().toISOString()
    }))
  }

  const NoteListItem = ({ note }) => (
    <div 
      onClick={() => {
        setSelectedNote(note)
        setIsCreatingNote(false)
        setIsEditing(false)
      }}
      className={`flex items-start p-4 hover:bg-[#f8f7fd] border-b border-[#e9e8f8] cursor-pointer group transition-colors relative ${
        selectedNote?.id === note.id ? 'bg-[#f8f7fd]' : ''
      }`}
    >
      <div className="flex-1 pr-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[#594d8c] truncate">{note.title}</h3>
          <div className="flex items-center space-x-2">
            {note.isPinned && (
              <span className="text-[#a69ed9]">📌</span>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setActiveMenu(activeMenu === note.id ? null : note.id)
              }}
              className="text-[#a69ed9] hover:text-[#7b6eac] transition-colors opacity-0 group-hover:opacity-100 p-1 hover:bg-[#e9e8f8] rounded"
            >
              ⋮
            </button>
          </div>
        </div>
        <time className="text-xs text-[#a69ed9] block mt-1">
          {new Date(note.date).toLocaleDateString()}
        </time>
      </div>

      {/* Context Menu */}
      {activeMenu === note.id && (
        <div 
          className="absolute right-12 top-10 w-36 bg-white rounded-lg shadow-lg border border-[#e9e8f8] py-1 z-50"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => {
              handleTogglePin(note.id)
              setActiveMenu(null)
            }}
            className="w-full px-4 py-2 text-left text-sm text-[#594d8c] hover:bg-[#f8f7fd] flex items-center space-x-2"
          >
            <span>{note.isPinned ? 'Unpin' : 'Pin'}</span>
            <span>{note.isPinned ? '✖️' : '📌'}</span>
          </button>
          <button
            onClick={() => {
              handleDeleteNote(note.id)
              setActiveMenu(null)
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#f8f7fd] flex items-center space-x-2"
          >
            <span>Delete</span>
            <span>🗑️</span>
          </button>
          <button
            onClick={() => {
              setIsEditing(true)
              setIsCreatingNote(false)
              setSelectedNote(note)
              setActiveMenu(null)
            }}
            className="w-full px-4 py-2 text-left text-sm text-[#594d8c] hover:bg-[#f8f7fd] flex items-center space-x-2"
          >
            <span>Edit</span>
            <span>✏️</span>
          </button>
        </div>
      )}
    </div>
  )

  // Add click outside handler to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest('.group')) {
        setActiveMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeMenu])

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
      <NoteDetails
        note={selectedNote}
        isCreating={isCreatingNote}
        isEditing={isEditing}
        onSave={handleSaveNote}
        onUpdate={handleUpdateNote}
        onCancel={() => {
          setIsCreatingNote(false)
          setIsEditing(false)
        }}
      />
    </div>
  )
}