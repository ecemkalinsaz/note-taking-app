'use client'
import { defaultFolders } from '@/data/folders'

export default function NoteList({ notes, currentFolder }) {
  // Get current folder info
  const currentFolderInfo = defaultFolders.find(f => f.id === currentFolder) || {
    id: currentFolder,
    name: currentFolder,
    icon: '📁'
  }

  // Filter notes based on current folder
  const folderNotes = currentFolder === 'all' 
    ? notes 
    : notes?.filter(note => note.folderId === currentFolder) || []

  // Get pinned notes for current folder
  const pinnedNotes = folderNotes.filter(note => note.isPinned)
  
  // Get unpinned notes for current folder
  const unpinnedNotes = folderNotes.filter(note => !note.isPinned)

  const NoteCard = ({ note }) => (
    <div className="p-4 bg-white rounded-lg border border-[#e9e8f8] hover:shadow-md transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xl group-hover:scale-110 inline-block transition-transform">
            {note.emoji}
          </span>
          <h3 className="font-medium text-[#594d8c] mt-2">{note.title}</h3>
        </div>
        <button className="text-[#a69ed9] hover:text-[#7b6eac]">
          {note.isPinned ? '📌' : ''}
        </button>
      </div>
      <p className="text-sm text-[#594d8c] mt-2 line-clamp-2">{note.snippet}</p>
      <time className="text-xs text-[#a69ed9] mt-2 block">
        {new Date(note.date).toLocaleDateString()}
      </time>
    </div>
  )

  return (
    <div className="flex-1 border-r border-[#e9e8f8] p-4 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Dynamic folder header */}
        <header className="flex items-center space-x-3 mb-8">
          <span className="text-2xl">{currentFolderInfo.icon}</span>
          <h1 className="text-2xl font-semibold text-[#594d8c]">
            {currentFolderInfo.name}
          </h1>
        </header>
        
        {pinnedNotes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[#594d8c] font-medium mb-3 flex items-center space-x-2">
              <span>📌</span>
              <span>Pinned in {currentFolderInfo.name}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedNotes.map(note => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-[#594d8c] font-medium mb-3">Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpinnedNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}