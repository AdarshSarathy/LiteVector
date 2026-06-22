import { useState, useRef, useEffect } from 'react'

function UploadingDocument ({ doc }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval

    if (doc.status === 'Pending'){
      interval = setInterval(() => {
        setProgress((prev) => {
          const remaining = 95 - prev
          const step = Math.max(0.5, remaining * 0.1)

          return prev >= 95 ? 95 : prev + step
        })
      }, 500)
    }
    else if (doc.status === 'Success'){
      setProgress(100)
      clearInterval(interval)
    }
    else if (doc.status === 'Failed'){
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [doc.status])

  const barColor = doc.status === 'Success' ? '#10b981':
                   doc.status === 'Failed' ? '#ef4444':
                   '#3b82f6'

  return (
    <div className='absolute bottom-0 left-0 w-full h-[4px] bg-zinc-950 overflow-hidden'>
      <div className='h-full transition-[width_0.5s_ease-out,_background-color_0.3s_ease]'
           style={{ width : `${progress}%`, backgroundColor: barColor}}>
      </div>
    </div>
  )

}

export default function App() {

  const [query, setQuery] = useState('')

  const [messages, setMessages] = useState([
    {role: 'assistant', text: 'Hello! I am connected to your LiteVector Database. Upload a document or ask a question.'}
  ])

  const [documents, setDocuments] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  // const [isUploaded, setIsUploaded] = useState(['Failed', 'Pending', 'Success'])

  const fileInputRef = useRef(null)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleZoneClick = () => {
    fileInputRef.current.click()
  }

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (documents.length >= 10) {
      alert("Database capacity reached! You can only index a maximum of 10 documents.")
      e.target.value = ''
      return
    }

    const isDuplicate = documents.some(doc => doc.name === selectedFile.name)
    if (isDuplicate) {
      alert(`The document "${selectedFile.name}" has already been indexed in the vector database.`)
      e.target.value = ''
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    const newDocId = Date.now()
    const newDoc = {
      name: selectedFile.name,
      size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
      status: 'Pending',
      id: newDocId
    }

    setDocuments([...documents, newDoc])

    try {

      const response = await fetch(`https://litevector-database-production.up.railway.app/upload`, {
        method: 'POST',
        body: formData
      })
      

      if (!response.ok) {
        setDocuments(prev => prev.map(doc => doc.id === newDocId ? {...doc, status: 'Failed'} : doc))
        throw new Error("Failed to upload document to vector database")
      }

      setDocuments(prev => prev.map(doc => doc.id === newDocId ? {...doc, status: 'Success'} : doc))
      
      
    } catch (error) {
      console.error('Upload Error: ',error)

      setDocuments(prev => prev.map(doc => doc.id === newDocId ? {...doc, status: 'Failed'} : doc))

      alert('There was an error connecting to the ingestion engine')

    } finally{
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!query.trim() || isTyping) return

    const userMessage = query

    setMessages(prev => [...prev, {role: 'user', text: userMessage}])

    setIsTyping(true)

    try {
      const response = await fetch(`https://litevector-database-production.up.railway.app/search`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: userMessage,
          top_k: 2
        })
      })
      if (!response.ok) {
       throw new Error(`Server responded with status: ${response.status}`) 
      }

      const rawResults = await response.json()
      console.log("INCOMING API PAYLOAD", rawResults)

      let targetText = `Here are the top matches from your vector database. \n\n`
      rawResults.results.forEach((result, index) => {
        targetText += `[Match ${index + 1} | Score: ${result.score.toFixed(3)}]\n${result.text}\n\n`
      })

      setMessages(prev => [...prev, {role: 'assistant', text: ''}])

      setQuery('')
      
      let targetIndex = 0
      const intervalId = setInterval(() => {

        const nextCharacter = targetText[targetIndex]
        
        setMessages(prev => {
          if (targetIndex >= targetText.length) {
            clearInterval(intervalId)
            setIsTyping(false)
            return prev
          }
          
          const updatedMessages = [...prev]
          const lastIndex = updatedMessages.length-1
          
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            text: updatedMessages[lastIndex].text + nextCharacter
          }
          
          return updatedMessages
        })
        
        targetIndex += 1
        
        if (targetIndex === targetText.length) {
          clearInterval(intervalId)
        }
        
      }, 10)
    } catch (error) {
      console.error('Network Error: ', error)
      setIsTyping(false)
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: 'Error: Could not connect to the database. Check the console for details.'
      }])
    }
  }

  const handleDeleteFile = (idToRemove) => {
    const newList = documents.filter(doc => doc.id != idToRemove)

    setDocuments(newList)
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-zinc-100 font-sans">
      {/* 
            LEFT SIDEBAR ====================> DOCUMENT MANAGEMENT 
      */}

      <div className='w-80 border-r border-zinc-800 bg-zinc-900/50 p-4 flex flex-col'>
        <h2 className='text-lg font-semibold text-zinc-100 mb-6 tracking-tight'>LiteVector Workspace</h2>

        {/* Hidden Native File Input */}
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileUpload}
          className='hidden'
          accept='.pdf,.txt,.json'
        />

        {/* Styled Trigger Zone */}
        <div
          onClick={handleZoneClick}
          className='border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 transition=colors cursor-pointer mb-6'
        >
          <p className='text-sm font-medium'>Click to upload document</p>
          <p className='text-xs mt-1 opacity-70'>PDF, TXT or JSON</p>
        </div>

        {/* Dynamic Document List */}
        <div className='flex-1'>
          <h3 className='text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3'>Indexed Documents</h3>

          {documents.length === 0 ? (
            <p className='text-xs text-zinc-600 italic'>No documents indexed yet.</p>
          ) : (
            <ul className='space-y-2 text-sm'>
              {documents.map((doc) => (
                <li key={doc.id} className='group flex items-center space-x-2 text-zinc-300 bg-zinc-800/50 p-2 rounded-md relative'>
                  <div className='flex items-center space-x-2 truncate'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500 shrink-0'></span>
                    <span className='truncate'>{doc.name}</span>
                  </div>
                  <div className='relative flex items-center justify-end w-16 shrink-0 h-5'>
                    <span className='absolute right-0 text-[10px] text-zinc-500 transition-opacity duration-300 opacity-100 group-hover:opacity-0 pointer-events-none'>{doc.size}</span>
                    <button className='absolute right-0 text-[10px] font-bold text-red-500 transition-opacity duration-300 opacity-0 group-hover:opacity-100 cursor-pointer tracking-wider' onClick={() => handleDeleteFile(doc.id)}>DELETE</button>
                  </div>
                  <UploadingDocument doc= {doc} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Database Status Tracking Capacity */}
        <div className='mt-auto pt-4 border-t border-zinc-800'>
          <div className='flex justify-between text-sx text-zinc-500 mb-1'>
            <span>Database Slots</span>
            <span>{documents.length} / 10</span>
          </div>
          <div className='w-full bg-zinc-800 rounded-full h-1.5'>
            <div className='bg-emerald-500 h-1.5 rounded-full transition-all duration-300'
            style={{ width: `${(documents.length / 10) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 
             MAIN CANVAS ====================> CHAT INTERFACE 
      */}
      <div className='flex-1 flex flex-col relative'>

        {/* Chat History Area */}
        <div ref={chatContainerRef} className='flex-1 overflow-y-auto p-6 space-y-6 flex flex-col'>
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-zinc-800 border border-zinc-950 text-zinc-50 rounded-tr-none' : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className='p-4 border-t border-zinc-800 bg-zinc-950'>
          <div className='max-w-3xl mx-auto'>
            <form onSubmit={handleSubmit} className='relative flex items-center'>
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Ask about your documents...'
                className='w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-4 pr-12 py-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all'
              />
              <button
                type='submit'
                className='absolute right-3 p-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 rounded-lg font-medium transition-colors disabled:opacity-50'
                disabled={!query.trim() || isTyping}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>


    </div>
  )
}
