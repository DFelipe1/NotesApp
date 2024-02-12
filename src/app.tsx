import { ChangeEvent, useState } from 'react'
import logo from './assets/Logo.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

interface Note {
  id: string
  createdAt: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const[notes, setNotes] = useState<Note[]>(() =>  {
    const noteOnStorage = localStorage.getItem('notes')

    if(noteOnStorage){
      return JSON.parse(noteOnStorage)
    }
    
    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      content
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id;
    })

    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase()))
    : notes
  
  return (
    <div className="max-w-6xl my-12 space-y-6  mx-auto px-5">
      <img 
        src={logo}
        className='w-fit'
      />
      <form className='w-full'>
        <input 
          type="text" 
          placeholder="Busque em suas notas..."
          className="bg-transparent text-xl md:text-3xl placeholder:text-slate-500 font-semibold tracking-tight leading-9 outline-none"
          onChange={handleSearch}
        />
      </form>

      <div className='w-full h-px bg-slate-700 rounded-sm'/>

      <div className='w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated}/>

        {filteredNotes.map(note => (
          <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
        ))}
        
      </div>
    </div>
  )
}
