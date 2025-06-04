const handleCreateFolder = (folderName) => {
  const newFolder = {
    id: Date.now().toString(),
    name: folderName,
    icon: '📁'
  }

  const savedFolders = JSON.parse(localStorage.getItem('folders') || '[]')
  savedFolders.push(newFolder)
  localStorage.setItem('folders', JSON.stringify(savedFolders))
  
  // ...rest of your folder creation logic...
}