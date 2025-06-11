'use client'
import { useState, useRef, useEffect } from 'react'

export default function NoteDetails({ 
  note, 
  isCreating,
  isEditing,
  onSave,
  onUpdate,
  onCancel 
}) {
  // Initialize with empty values
  const [editingNote, setEditingNote] = useState({
    title: '',
    content: ''
  })
  const textareaRef = useRef(null)
  const [showFontSize, setShowFontSize] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const [selectedSize, setSelectedSize] = useState('3')
  const [selectedColor, setSelectedColor] = useState('#594d8c')

  // Reset both title and content when isCreating changes
  useEffect(() => {
    if (isCreating) {
      setEditingNote({
        title: '',
        content: ''
      })
      // Clear the contentEditable div content
      if (textareaRef.current) {
        textareaRef.current.innerHTML = ''
      }
    } else if (isEditing && note) {
      setEditingNote({
        title: note.title,
        content: note.content
      })
      if (textareaRef.current) {
        textareaRef.current.innerHTML = note.content || ""
      }
    } else if (note) {
      setEditingNote({
        title: note.title,
        content: note.content
      })
    }
  }, [isCreating, isEditing, note])

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value)
    textareaRef.current?.focus()
  }

  const fontSizes = [
    { label: 'Small', value: '1', size: '13px' },
    { label: 'Normal', value: '3', size: '15px' },
    { label: 'Medium', value: '4', size: '16px' },
    { label: 'Large', value: '5', size: '18px' },
    { label: 'Extra Large', value: '6', size: '20px' }
  ]

  const textColors = [
    { label: 'Default', value: '#594d8c' },
    { label: 'Purple', value: '#7b6eac' },
    { label: 'Red', value: '#e44747' },
    { label: 'Green', value: '#47e447' },
    { label: 'Blue', value: '#4747e4' }
  ]

  const formatOptions = [
    {
      icon: '↶',
      command: 'undo',
      title: 'Undo'
    },
    {
      icon: '↷',
      command: 'redo',
      title: 'Redo'
    },
    { icon: 'B', command: 'bold', title: 'Bold' },
    { icon: 'I', command: 'italic', title: 'Italic' },
    { icon: 'U', command: 'underline', title: 'Underline' },
    { icon: 'S', command: 'strikeThrough', title: 'Strike through' },
    {
      icon: '•',
      command: 'insertUnorderedList',
      title: 'Bullet list'
    },
    {
      icon: '1.',
      command: 'insertOrderedList',
      title: 'Number list'
    }
  ]

  const handleSave = () => {
    const noteData = {
      title: editingNote.title,
      content: textareaRef.current.innerHTML
    }

    if (isEditing && note) {
      onUpdate({ ...noteData, id: note.id })
    } else {
      onSave(noteData)
    }
  }

  return (
    <div className="flex-1 bg-white pr-20">
      {(isCreating || isEditing) ? (
        <div className="h-full relative">
          <div className="p-6">
            <input
              type="text"
              placeholder="Note title"
              value={editingNote.title}
              onChange={(e) => setEditingNote(prev => ({ ...prev, title: e.target.value }))}
              className="w-full text-xl font-medium text-[#594d8c] placeholder-[#a69ed9] bg-transparent focus:outline-none"
            />
            <div
              ref={textareaRef}
              contentEditable
              className="w-full h-[calc(100vh-300px)] mt-4 text-[#594d8c] focus:outline-none"
              onInput={(e) => setEditingNote(prev => ({ ...prev, content: e.target.innerHTML }))}
              placeholder="Start writing..."
            />
          </div>

          {/* Formatting Toolbar */}
          <div className="absolute bottom-[68px] left-0 right-0 p-2 bg-white border-t border-[#e9e8f8] flex items-center space-x-2">
            {/* Font Size Button */}
            <div className="relative">
              <button
                onClick={() => setShowFontSize(!showFontSize)}
                className="px-3 py-2 flex items-center space-x-2 hover:bg-[#f8f7fd] rounded text-[#594d8c] transition-colors"
              >
                <span className="text-sm">
                  {fontSizes.find(s => s.value === selectedSize)?.label || 'Size'}
                </span>
                <span className="text-xs">▼</span>
              </button>
              
              {showFontSize && (
                <div className="absolute bottom-full left-0 mb-1 w-36 bg-white rounded-lg shadow-lg border border-[#e9e8f8] py-1 z-50">
                  {fontSizes.map(size => (
                    <button
                      key={size.value}
                      onClick={() => {
                        handleFormat('fontSize', size.value)
                        setSelectedSize(size.value)
                        setShowFontSize(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[#f8f7fd] transition-colors flex items-center justify-between ${
                        selectedSize === size.value ? 'text-[#7b6eac] font-medium' : 'text-[#594d8c]'
                      }`}
                      style={{ fontSize: size.size }}
                    >
                      {size.label}
                      {selectedSize === size.value && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color Picker Button */}
            <div className="relative">
              <button
                onClick={() => setShowColors(!showColors)}
                className="px-3 py-2 flex items-center space-x-2 hover:bg-[#f8f7fd] rounded text-[#594d8c] transition-colors"
              >
                <div 
                  className="w-4 h-4 rounded-full border border-[#e9e8f8]" 
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-xs">▼</span>
              </button>

              {showColors && (
                <div className="absolute bottom-full left-0 mb-1 w-36 bg-white rounded-lg shadow-lg border border-[#e9e8f8] p-2 z-50">
                  <div className="grid grid-cols-5 gap-1">
                    {textColors.map(color => (
                      <button
                        key={color.value}
                        onClick={() => {
                          handleFormat('foreColor', color.value)
                          setSelectedColor(color.value)
                          setShowColors(false)
                        }}
                        className={`w-6 h-6 rounded-full border border-[#e9e8f8] hover:scale-110 transition-transform ${
                          selectedColor === color.value ? 'ring-2 ring-[#7b6eac] ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-[#e9e8f8] mx-2" />

            {formatOptions.map(option => (
              <button
                key={option.command}
                onClick={() => handleFormat(option.command)}
                className="p-2 hover:bg-[#f8f7fd] rounded text-[#594d8c] transition-colors"
                title={option.title}
              >
                {option.icon}
              </button>
            ))}
          </div>

          {/* Save/Cancel Buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[#e9e8f8]">
            <div className="flex justify-end space-x-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-[#594d8c] hover:bg-[#f8f7fd] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#7b6eac] hover:bg-[#6a5d9b] text-white rounded-lg transition-colors shadow-sm"
              >
                {isEditing ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      ) : note ? ( // Add conditional check for note
        <div className="p-6">
          <h1 className="text-xl font-medium text-[#594d8c]">{note.title}</h1>
          <div 
            className="mt-4 text-[#594d8c]"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      ) : (
        // Show placeholder when no note is selected
        <div className="h-full flex items-center justify-center text-[#a69ed9]">
          <p>Select a note or create a new one</p>
        </div>
      )}
    </div>
  )
}