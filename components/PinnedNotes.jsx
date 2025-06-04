import React from 'react'

export default function PinnedNotes({ notes, currentFolder, onTogglePin }) {
  const currentFolderInfo = {
    name: currentFolder === 'all' ? 'All Notes' : currentFolder
  }

  if (!notes || notes.length === 0) return null

  return (
    <div className="mb-6">
      <h2 className="text-[#594d8c] font-medium mb-3 flex items-center space-x-2">
        <span>📌</span>
        <span>Pinned in {currentFolderInfo.name}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <div key={note.id} className="p-4 bg-white rounded-lg border border-[#e9e8f8] hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xl group-hover:scale-110 inline-block transition-transform">
                  {note.emoji}
                </span>
                <h3 className="font-medium text-[#594d8c] mt-2">{note.title}</h3>
              </div>
              <button 
                onClick={() => onTogglePin(note.id)}
                className="text-[#a69ed9] hover:text-[#7b6eac] transition-colors"
              >
                📌
              </button>
            </div>
            <p className="text-sm text-[#594d8c] mt-2 line-clamp-2">{note.snippet}</p>
            <time className="text-xs text-[#a69ed9] mt-2 block">
              {new Date(note.date).toLocaleDateString()}
            </time>
          </div>
        ))}
      </div>
    </div>
  )
}