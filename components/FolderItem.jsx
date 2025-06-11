'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function FolderItem({ 
  folder, 
  isActive, 
  onRename, 
  onDelete 
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(folder.name)
  const menuRef = useRef(null)

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleRename = () => {
    setIsEditing(true)
    setShowMenu(false)
  }

  const handleSubmitRename = () => {
    if (editedName.trim()) {
      onRename(folder.id, editedName.trim())
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    onDelete(folder.id)
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <Link
        href={`/folders/${folder.id}`}
        className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f2f6fc] text-[#345995] group ${
          isActive ? 'bg-[#f2f6fc] font-medium' : ''
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <span>{folder.icon}</span>
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSubmitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmitRename()
                }
              }}
              className="bg-transparent focus:outline-none w-full"
              autoFocus
            />
          ) : (
            <span className="truncate">{folder.name}</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            setShowMenu(!showMenu)
          }}
          className="opacity-0 group-hover:opacity-100 hover:bg-[#e0e7f1] p-1 rounded transition-all ml-2 shrink-0"
        >
          ⋮
        </button>
      </Link>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-[#e0e7f1] py-1 z-50"
        >
          <button
            onClick={handleRename}
            className="w-full px-4 py-2 text-left text-sm text-[#345995] hover:bg-[#f2f6fc] flex items-center space-x-2"
          >
            <span>Rename</span>
            <span>✏️</span>
          </button>
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#f2f6fc] flex items-center space-x-2"
          >
            <span>Delete</span>
            <span>🗑️</span>
          </button>
        </div>
      )}
    </div>
  )
}