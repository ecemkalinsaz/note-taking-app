'use client'
import { useState, useEffect } from 'react'
import { defaultFolders } from '@/data/folders'
import NoteDetails from './NoteDetails'

export default function NoteList({ notes: initialNotes, currentFolder }) {
  const [notes, setNotes] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedNotes = localStorage.getItem('notes')
      return savedNotes ? JSON.parse(savedNotes) : []
    }
    return []
  })
  const [selectedNote, setSelectedNote] = useState(null)
  const [isCreatingNote, setIsCreatingNote] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [currentFolderInfo, setCurrentFolderInfo] = useState({
    id: currentFolder,
    name: 'Untitled',
    icon: '📁'
  })

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes))
    }
  }, [notes])

  // Update handleSaveNote to actually save the note
  const handleSaveNote = (noteData) => {
    const note = {
      id: Date.now().toString(),
      ...noteData,
      title: noteData.title.trim() || 'New Note',
      date: new Date().toISOString(),
      folderId: currentFolder,
      isPinned: false,
      snippet: noteData.content.replace(/<[^>]*>/g, '').slice(0, 100),
      titleStyle: noteData.titleStyle // Title stilini de kaydet
    }

    setNotes(prevNotes => [...prevNotes, note])
    setIsCreatingNote(false)
    setSelectedNote(note) // Bu zaten doğru çünkü note objesi titleStyle'ı içeriyor
  }

  // Get current folder info
  // const currentFolderInfo = defaultFolders.find(f => f.id === currentFolder) || {
  //   id: currentFolder,
  //   // If it's not a default folder, use the folder name from localStorage
  //   name: localStorage.getItem('folders') 
  //     ? JSON.parse(localStorage.getItem('folders')).find(f => f.id === currentFolder)?.name || 'Untitled'
  //     : currentFolder,
  //   icon: '📁'
  // }

  // Move localStorage logic to useEffect
  useEffect(() => {
    const getFolderInfo = () => {
      // Special case for "all" folder
      if (currentFolder === 'all') {
        setCurrentFolderInfo({
          id: 'all',
          name: 'All Notes',
          icon: '📝'
        })
        return
      }

      const savedFolders = localStorage.getItem('folders')
      if (savedFolders) {
        const folderData = JSON.parse(savedFolders).find(f => f.id === currentFolder)
        if (folderData) {
          setCurrentFolderInfo({
            id: currentFolder,
            name: folderData.name,
            icon: folderData.icon || '📁'
          })
        }
      }
    }

    getFolderInfo()
  }, [currentFolder])

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
          className="text-[#e8f1fc] hover:text-[#7b6eac] transition-colors"
        >
          {note.isPinned ? '' : '📌'}
        </button>
      </div>
      <p className="text-sm text-[#594d8c] mt-2 line-clamp-2">{note.snippet}</p>
      <time className="text-xs text-[#7c8d95] mt-2 block">
        {new Date(note.date).toLocaleDateString()}
      </time>
    </div>
  )

  const handleCreateNote = () => {
    setIsCreatingNote(true)
  }

  // handleUpdateNote fonksiyonunu düzelt
  const handleUpdateNote = (noteId, noteData) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === noteId 
          ? {
              ...note,
              title: noteData.title.trim() || 'New Note',
              content: noteData.content,
              titleStyle: noteData.titleStyle, // Title stilini güncelle
              snippet: noteData.content.replace(/<[^>]*>/g, '').slice(0, 100),
              date: new Date().toISOString()
            }
          : note
      )
    )
    setIsEditing(false)
    
    // selectedNote'u güncellerken titleStyle'ı da dahil et
    const updatedNote = {
      ...selectedNote,
      title: noteData.title.trim() || 'New Note',
      content: noteData.content,
      titleStyle: noteData.titleStyle,
      snippet: noteData.content.replace(/<[^>]*>/g, '').slice(0, 100),
      date: new Date().toISOString()
    }
    setSelectedNote(updatedNote)
  }

  const NoteListItem = ({ note }) => (
    <div 
      onClick={() => setSelectedNote(note)}
      className={`flex items-start p-4 hover:bg-[#e8f1fc] border-b border-[#e8e8e8] cursor-pointer group transition-colors relative ${
        selectedNote?.id === note.id ? 'bg-[#e8f1fc]' : ''
      }`}
    >
      <div className="flex-1 pr-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[#345995] truncate max-w-[180px]">{note.title}</h3>
          <div className="flex items-center space-x-2">
            {note.isPinned && (
              <span className="text-[#345995]">📌</span>
            )}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveMenu(activeMenu === note.id ? null : note.id)
                }}
                className="text-[#345995] hover:text-[#2a477a] transition-colors opacity-0 group-hover:opacity-100 p-1 hover:bg-[#f2f6fc] rounded"
              >
                ⋮
              </button>
              
              {activeMenu === note.id && (
                <div 
                  className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-[#e8e8e8] py-1 z-50"
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
                      setIsEditing(true)
                      setSelectedNote(note)
                      setActiveMenu(null)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-[#594d8c] hover:bg-[#f8f7fd] flex items-center space-x-2"
                  >
                    <span>Edit</span>
                    <span>✏️</span>
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
                </div>
              )}
            </div>
          </div>
        </div>
        <time className="text-xs text-[#7c8d95] block mt-1">
          {new Date(note.date).toLocaleDateString()}
        </time>
      </div>
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
    <div className="flex flex-1 border-r border-[#e8f1fc]">
      <div className="w-80 border-r border-[#e8f1fc] overflow-y-auto bg-white">
        <header className="flex items-center justify-between p-4 border-b border-[#e8f1fc] relative">
          <div className="flex items-center space-x-3 min-w-0 flex-1"> {/* Added min-w-0 and flex-1 */}
            <span className="text-2xl flex-shrink-0">{currentFolderInfo.icon}</span>
            <h1 className="text-xl font-semibold text-[#345995] truncate">
              {currentFolderInfo.name}
            </h1>
          </div>
          <button 
            onClick={handleCreateNote}
            className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#EAC435] hover:bg-[#d4b02f] text-white rounded-lg transition-all duration-200 relative group shadow-sm ml-3"
          >
            <span className="text-xl">+</span>
          </button>
        </header>

        {/* Only show Pinned section if there are pinned notes */}
        {pinnedNotes.length > 0 && (
          <>
            <div className="py-2 px-4 bg-[#f7f7f7] text-xs text-[#345995]">
              Pinned
            </div>
            {pinnedNotes.map(note => (
              <NoteListItem key={note.id} note={note} />
            ))}
            {/* Add separator after pinned notes */}
            <div className="h-2 bg-[#f7f7f7]" />
          </>
        )}

        {/* Show unpinned notes without a header */}
        {unpinnedNotes.map(note => (
          <NoteListItem key={note.id} note={note} />
        ))}
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