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
  const [activeField, setActiveField] = useState('content') // 'title' veya 'content'
  const [titleStyle, setTitleStyle] = useState({
    color: '#345995',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: '20px' // Başlık için daha büyük default
  })

  // Reset both title and content when isCreating changes
  useEffect(() => {
    if (isCreating) {
      setEditingNote({
        title: '',
        content: ''
      })
      setTitleStyle({
        color: '#345995',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        fontSize: '20px'
      })
      if (textareaRef.current) {
        textareaRef.current.innerHTML = ''
      }
    } else if (isEditing && note) {
      setEditingNote({
        title: note.title,
        content: note.content
      })
      setTitleStyle(note.titleStyle || {
        color: '#345995',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        fontSize: '20px'
      })
      // setTimeout ile DOM update'ini bekle
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.innerHTML = note.content || ""
        }
      }, 0)
    } else if (note) {
      setEditingNote({
        title: note.title,
        content: note.content
      })
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.innerHTML = note.content || ""
        }
      }, 0)
    }
  }, [isCreating, isEditing, note])

  const handleFormat = (command, value = null) => {
    if (activeField === 'content') {
      document.execCommand(command, false, value)
      textareaRef.current?.focus()
      
      setTimeout(() => {
        if (textareaRef.current) {
          setEditingNote(prev => ({ 
            ...prev, 
            content: textareaRef.current.innerHTML 
          }))
        }
      }, 10)
      
    } else if (activeField === 'title') {
      setTitleStyle(prev => {
        switch (command) {
          case 'foreColor':
            return { ...prev, color: value }
          case 'fontSize':
            // Başlık için daha büyük font size mapping
            const titleSizeMap = {
              '1': '16px',   // Small title
              '2': '18px',   // 
              '3': '20px',   // Normal title (default)
              '4': '24px',   // Medium title
              '5': '28px',   // Large title
              '6': '32px'    // Extra Large title
            }
            return { ...prev, fontSize: titleSizeMap[value] || '20px' }
          case 'bold':
            return { ...prev, fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold' }
          case 'italic':
            return { ...prev, fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic' }
          case 'underline':
            return { ...prev, textDecoration: prev.textDecoration.includes('underline') ? 'none' : 'underline' }
          case 'strikeThrough':
            return { ...prev, textDecoration: prev.textDecoration.includes('line-through') ? 'none' : 'line-through' }
          default:
            return prev
        }
      })
    }
  }

  const fontSizes = [
    { label: 'Small', value: '1', size: '13px' },
    { label: 'Normal', value: '3', size: '15px' },
    { label: 'Medium', value: '4', size: '16px' },
    { label: 'Large', value: '5', size: '18px' },
    { label: 'Extra Large', value: '6', size: '20px' }
  ]

  const textColors = [
    { label: 'Blue', value: '#345995' },
    { label: 'Green', value: '#8DA168' },
    { label: 'Orange', value: '#E28413' },
    { label: 'Purple', value: '#9B7EDE' },
    { label: 'Red', value: '#DE3C4B' },
    
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
    { icon: 'S', command: 'strikeThrough', title: 'Strike through' }
  ]

  const handleSave = () => {
    // Kaydetmeden önce en güncel içeriği doğrudan DOM'dan al
    const currentContent = textareaRef.current ? textareaRef.current.innerHTML : editingNote.content;
    
    const noteData = {
      title: editingNote.title,
      content: currentContent, // DOM'dan alınan güncel içerik
      titleStyle: titleStyle
    }

    if (isEditing && note) {
      onUpdate(note.id, noteData)
    } else {
      onSave(noteData)
    }
  }

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sizeButton = event.target.closest('[data-size-button]')
      const sizeMenu = event.target.closest('[data-size-menu]')
      const colorButton = event.target.closest('[data-color-button]')
      const colorMenu = event.target.closest('[data-color-menu]')

      if (!sizeButton && !sizeMenu) {
        setShowFontSize(false)
      }

      if (!colorButton && !colorMenu) {
        setShowColors(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
              onFocus={() => setActiveField('title')}
              className="w-full text-xl font-medium bg-transparent focus:outline-none placeholder:text-[#b4c0d3]"
              style={{
                color: titleStyle.color,
                fontWeight: titleStyle.fontWeight,
                fontStyle: titleStyle.fontStyle,
                textDecoration: titleStyle.textDecoration,
                fontSize: titleStyle.fontSize // Font size ekle
              }}
            />
            <div className="relative">
              <div
                ref={textareaRef}
                contentEditable
                className="w-full h-[calc(100vh-300px)] mt-4 text-[#345995] focus:outline-none"
                onInput={(e) => {
                  // innerHTML'i state'e kaydet (formatlar da dahil)
                  setEditingNote(prev => ({ ...prev, content: e.target.innerHTML }))
                }}
                onFocus={() => setActiveField('content')}
                tabIndex={0}
                suppressContentEditableWarning={true} // Bu warning'i gizler
              />
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="absolute bottom-[68px] left-0 right-0 p-2 bg-white border-t border-[#e0e7f1] flex items-center space-x-2">
            {/* Font Size Button */}
            <div className="relative">
              <button
                data-size-button
                onClick={() => setShowFontSize(!showFontSize)}
                className="px-3 py-2 flex items-center space-x-2 hover:bg-[#f2f6fc] rounded text-[#345995] transition-colors"
              >
                <span className="text-sm">
                  {fontSizes.find(s => s.value === selectedSize)?.label || 'Size'}
                </span>
                <span className="text-xs">▼</span>
              </button>
              
              {showFontSize && (
                <div 
                  data-size-menu
                  className="absolute bottom-full left-0 mb-1 w-36 bg-white rounded-lg shadow-lg border border-[#e0e7f1] py-1 z-50"
                >
                  {fontSizes.map(size => (
                    <button
                      key={size.value}
                      onClick={() => {
                        handleFormat('fontSize', size.value)
                        setSelectedSize(size.value)
                        setShowFontSize(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[#f2f6fc] transition-colors flex items-center justify-between ${
                        selectedSize === size.value ? 'text-[#345995] font-medium' : 'text-[#345995]'
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
                data-color-button
                onClick={() => setShowColors(!showColors)}
                className="px-3 py-2 flex items-center space-x-2 hover:bg-[#f2f6fc] rounded text-[#345995] transition-colors"
              >
                <div 
                  className="w-4 h-4 rounded-full border border-[#e0e7f1]" 
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-xs">▼</span>
              </button>

              {showColors && (
                <div 
                  data-color-menu
                  className="absolute bottom-full left-0 mb-1 w-36 bg-white rounded-lg shadow-lg border border-[#e0e7f1] p-2 z-50"
                >
                  <div className="grid grid-cols-5 gap-1">
                    {textColors.map(color => (
                      <button
                        key={color.value}
                        onClick={() => {
                          handleFormat('foreColor', color.value)
                          setSelectedColor(color.value)
                          setShowColors(false)
                        }}
                        className={`w-6 h-6 rounded-full border border-[#e0e7f1] hover:scale-110 transition-transform ${
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

            <div className="h-6 w-[1px] bg-[#e0e7f1] mx-2" />

            {formatOptions.map(option => (
              <button
                key={option.command}
                onClick={() => handleFormat(option.command)}
                className="p-2 hover:bg-[#f2f6fc] rounded text-[#345995] transition-colors"
                title={option.title}
              >
                {option.icon}
              </button>
            ))}
          </div>

          {/* Save/Cancel Buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-[#e0e7f1]">
            <div className="flex justify-end space-x-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-[#345995] hover:bg-[#f2f6fc] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#EAC435] hover:bg-[#d4b02f] text-white rounded-lg transition-colors shadow-sm"
              >
                {isEditing ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      ) : note ? ( // Add conditional check for note
        <div className="p-6">
          <h1 
            className="text-xl font-medium"
            style={{
              color: note.titleStyle?.color || '#345995',
              fontWeight: note.titleStyle?.fontWeight || 'normal',
              fontStyle: note.titleStyle?.fontStyle || 'normal',
              textDecoration: note.titleStyle?.textDecoration || 'none',
              fontSize: note.titleStyle?.fontSize || '20px' // Font size ekle
            }}
            dangerouslySetInnerHTML={{ __html: note.title }}
          />
          <div 
            className="mt-4 text-[#345995]"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      ) : (
        // Show placeholder when no note is selected
        <div className="h-full flex items-center justify-center text-[#b4c0d3]">
          <p>Select a note or create a new one</p>
        </div>
      )}
    </div>
  )
}