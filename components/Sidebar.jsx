'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const [folders, setFolders] = useState([
    { id: 'all', name: 'All Notes', icon: '📝' },
    { id: 'favorites', name: 'Favorites', icon: '⭐' },
    { id: 'work', name: 'Work', icon: '💼' },
    { id: 'personal', name: 'Personal', icon: '🏠' }
  ])
  const [customFolders, setCustomFolders] = useState([])
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const handleAddFolder = (e) => {
    e.preventDefault()
    if (newFolderName.trim()) {
      setCustomFolders([...customFolders, {
        id: Date.now().toString(),
        name: newFolderName,
        icon: '📁'
      }])
      setNewFolderName('')
      setIsAddingFolder(false)
    }
  }

  const isActiveFolder = (folderId) => {
    return pathname === `/folders/${folderId}`
  }

  return (
    <aside className="w-64 h-screen bg-white border-r border-[#e9e8f8] p-4 flex flex-col">
      {/* Search Box */}
      <div className="relative mb-4">
        <input
          type="search"
          placeholder="Search notes..."
          className="w-full bg-[#f8f7fd] text-[#594d8c] placeholder-[#a69ed9] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b6eac]"
        />
      </div>

      {/* Navigation */}
      <nav className="mb-8 space-y-1">
        {folders.map(folder => (
          <Link
            key={folder.id}
            href={`/folders/${folder.id}`}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#f8f7fd] text-[#594d8c] ${
              isActiveFolder(folder.id) ? 'bg-[#f8f7fd] font-medium' : ''
            }`}
          >
            <span>{folder.icon}</span>
            <span>{folder.name}</span>
          </Link>
        ))}
      </nav>

      {/* Custom Folders Section */}
      <div className="border-t border-[#e9e8f8] pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-[#594d8c]">Folders</h3>
          <button
            onClick={() => setIsAddingFolder(true)}
            className="p-1 hover:bg-[#f8f7fd] rounded-md transition-colors"
            title="New folder"
          >
            ➕
          </button>
        </div>

        {isAddingFolder && (
          <form onSubmit={handleAddFolder} className="mb-2 relative">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              className="w-full p-2 pr-20 rounded-lg border border-[#e9e8f8] focus:outline-none focus:ring-2 focus:ring-[#7b6eac]"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 bg-[#7b6eac] hover:bg-[#6a5d9b] text-white rounded-r-lg transition-colors text-sm border border-[#7b6eac]"
            >
              Add
            </button>
          </form>
        )}

        <div className="space-y-1">
          {customFolders.map(folder => (
            <Link
              key={folder.id}
              href={`/folders/${folder.id}`}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#f8f7fd] text-[#594d8c] ${
                isActiveFolder(folder.id) ? 'bg-[#f8f7fd] font-medium' : ''
              }`}
            >
              <span>{folder.icon}</span>
              <span>{folder.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}