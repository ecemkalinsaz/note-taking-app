'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  return (
    <>
      <aside className="w-64 h-screen bg-white border-r border-[#e9e8f8] p-4 flex flex-col">
        {/* Search Box */}
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search notes..."
            className="w-full bg-[#f8f7fd] text-[#594d8c] placeholder-[#a69ed9] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7b6eac]"
          />
        </div>

        {/* All Notes */}
        <Link
          href="/folders/all"
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#f8f7fd] text-[#594d8c] mb-4 ${
            pathname === '/folders/all' ? 'bg-[#f8f7fd] font-medium' : ''
          }`}
        >
          <span>📝</span>
          <span>All Notes</span>
        </Link>

        {/* Folders Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-[#594d8c] px-3">Folders</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1 hover:bg-[#f8f7fd] rounded-md transition-colors"
              title="New folder"
            >
              ➕
            </button>
          </div>
          <nav className="space-y-1">
            {folders.map(folder => (
              <Link
                key={folder.id}
                href={`/folders/${folder.id}`}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#f8f7fd] text-[#594d8c] ${
                  pathname === `/folders/${folder.id}` ? 'bg-[#f8f7fd] font-medium' : ''
                }`}
              >
                <span>{folder.icon}</span>
                <span>{folder.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Create Folder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 border border-[#e9e8f8]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#594d8c]">Create New Folder</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#a69ed9] hover:text-[#7b6eac]"
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
                className="w-full p-3 rounded-lg border border-[#e9e8f8] bg-white focus:outline-none focus:ring-2 focus:ring-[#7b6eac] mb-4"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#594d8c] hover:bg-[#f8f7fd] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7b6eac] hover:bg-[#6a5d9b] text-white rounded-lg transition-colors"
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