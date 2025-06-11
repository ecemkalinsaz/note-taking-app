'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FolderItem from './FolderItem'

export default function Sidebar() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [folders, setFolders] = useState([])

  // Load folders from localStorage on component mount
  useEffect(() => {
    const savedFolders = localStorage.getItem('folders')
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders))
    } else {
      // Set default folders if no saved folders exist
      const defaultFolders = [
        { id: 'favorites', name: 'Favorites', icon: '⭐' },
        { id: 'work', name: 'Work', icon: '💼' },
        { id: 'personal', name: 'Personal', icon: '🏠' }
      ]
      setFolders(defaultFolders)
      localStorage.setItem('folders', JSON.stringify(defaultFolders))
    }
  }, [])

  // Update localStorage whenever folders change
  useEffect(() => {
    if (folders.length > 0) {
      localStorage.setItem('folders', JSON.stringify(folders))
    }
  }, [folders])

  const handleAddFolder = (e) => {
    e.preventDefault()
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now().toString(),
        name: newFolderName,
        icon: '📁'
      }
      setFolders([...folders, newFolder])
      setNewFolderName('')
      setIsModalOpen(false)
    }
  }

  const handleRenameFolder = (folderId, newName) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, name: newName }
        : folder
    ))
  }

  const handleDeleteFolder = (folderId) => {
    setFolders(folders.filter(f => f.id !== folderId))
  }

  return (
    <>
      <aside className="w-64 h-screen bg-white border-r border-[#e8f1fc] p-4 flex flex-col">
        {/* Search Box */}
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search notes..."
            className="w-full bg-[#e8f1fc] text-[#345995] placeholder-[#6885b3] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#345995]"
          />
        </div>

        {/* All Notes */}
        <Link
          href="/folders/all"
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#e8f1fc] text-[#345995] mb-4 ${
            pathname === '/folders/all' ? 'bg-[#e8f1fc] font-medium' : ''
          }`}
        >
          <span>📝</span>
          <span>All Notes</span>
        </Link>

        {/* Folders Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-[#345995] px-3">Folders</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center bg-[#EAC435] hover:bg-[#d4b02f] text-white rounded-lg transition-all duration-200 relative group shadow-sm"
              title="New folder"
            >
              <span className="text-xl">+</span>
              <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200" 
                   style={{ top: 'calc(100% + 0.5rem)', zIndex: 50 }}>
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-1 w-2 h-2 bg-[#345995] rotate-45"></div>
                <div className="bg-[#345995] text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg">
                  New Folder
                </div>
              </div>
            </button>
          </div>
          <nav className="space-y-1">
            {folders.map(folder => (
              <FolderItem
                key={folder.id}
                folder={folder}
                isActive={pathname === `/folders/${folder.id}`}
                onRename={handleRenameFolder}
                onDelete={handleDeleteFolder}
              />
            ))}
          </nav>
        </div>
      </aside>

      {/* Updated Create Folder Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/20 z-[100]" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false)
            }
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-lg w-96 p-6 border border-[#e8f1fc] relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#345995]">Create New Folder</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#6885b3] hover:text-[#345995]"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddFolder}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full p-3 rounded-lg border border-[#e8f1fc] bg-white focus:outline-none focus:ring-2 focus:ring-[#345995] mb-4"
                autoFocus
                onKeyDown={e => e.stopPropagation()}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#345995] hover:bg-[#e8f1fc] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#345995] hover:bg-[#2a477a] text-white rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}