'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function FolderItem({ 
  folder, 
  isActive, 
  onRename, 
  onDelete 
}) {
  const [activeMenu, setActiveMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(folder.name)

  const truncateName = (name, maxLength = 20) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name
  }

  const handleRename = () => {
    if (editName.trim() && editName !== folder.name) {
      onRename(folder.id, editName.trim())
    }
    setIsEditing(false)
    setActiveMenu(false)
  }

  return (
    <div className="relative group">
      <Link
        href={`/folders/${folder.id}`}
        className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f8f7fd] text-[#594d8c] ${
          isActive ? 'bg-[#f8f7fd] font-medium' : ''
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0"> {/* Added min-w-0 for proper truncation */}
          <span className="flex-shrink-0">{folder.icon}</span>
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="bg-transparent border-b border-[#7b6eac] focus:outline-none px-1"
              autoFocus
            />
          ) : (
            <span className="truncate" title={folder.name}>
              {truncateName(folder.name)}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            setActiveMenu(!activeMenu)
          }}
          className="opacity-0 group-hover:opacity-100 hover:bg-[#e9e8f8] p-1 rounded transition-all flex-shrink-0"
        >
          ⋮
        </button>
      </Link>

      {/* Context Menu */}
      {activeMenu && (
        <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-[#e9e8f8] py-1 z-50">
          <button
            onClick={() => {
              setIsEditing(true)
              setActiveMenu(false)
            }}
            className="w-full px-4 py-2 text-left text-sm text-[#594d8c] hover:bg-[#f8f7fd] flex items-center space-x-2"
          >
            <span>✏️</span>
            <span>Rename</span>
          </button>
          <button
            onClick={() => {
              onDelete(folder.id)
              setActiveMenu(false)
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#f8f7fd] flex items-center space-x-2"
          >
            <span>🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}