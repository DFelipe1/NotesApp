import * as Dialog from '@radix-ui/react-dialog'
import { X, ArrowUpRight } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({onNoteCreated}: NewNoteCardProps) {
  const [isRecoding, setIsRecoding] = useState(false)
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true)
  const [content, setContent] = useState('')

  function handleStartEditor(){
    setShouldShowOnBoarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)

    if(event.target.value == ''){
      setShouldShowOnBoarding(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()
    if(content === ''){
      return
    }

    onNoteCreated(content)

    toast.success("Nota enviada com sucesso!")
    setShouldShowOnBoarding(true)
    setContent("")
  }

  function handleStartReconding(){
    

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionAPIAvailable){
      alert('Infelizmente seu navegador não suporta a API de gravação')
      return
    }

    setIsRecoding(true)
    setShouldShowOnBoarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }
  
  function handleStopReconding(){
    setIsRecoding(false)

    if(speechRecognition !== null){
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='group flex flex-col gap-3 text-left p-5 rounded-md bg-slate-700 relative overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-lime-400 hover:ring-2 hover:ring-slate-600 '>
        <div className='w-8 h-8 bg-slate-800 text-slate-600 absolute right-0 top-0 p-1.5 group-hover:text-slate-400'>
          <ArrowUpRight className='size-5 m-auto'/>
        </div>
        <h3 className='text-sm font-medium text-slate-200'>Adicionar nota</h3>
        <p className='text-sm text-slate-400  leading-6'>Grave uma nota em audio que será convertida em texto automaticamente</p>
      </Dialog.Trigger>

      <Dialog.Portal>
          <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
          <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
              <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                  <X className='size-5'/>
              </Dialog.Close>

              <form className='flex-1 flex flex-col'>
              
                <div className='flex flex-1 flex-col gap-3 p-5'>
                  <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>

                  {
                    shouldShowOnBoarding ? (
                      <p className='text-sm text-slate-400  leading-6'>
                        Comece {' '}
                        <button 
                          type='button'
                          className='font-medium text-lime-400 hover:underline'
                          onClick={handleStartReconding}
                        >
                          gravando uma nota em áudio
                        </button>
                        {" "} ou se preferir {" "}
                        <button 
                          type='button'
                          className='font-medium text-lime-400 hover:underline'
                          onClick={handleStartEditor}
                        >
                          utilize apenas texto.
                        </button>
                      </p>
                    ) : (
                      <textarea 
                        autoFocus
                        className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                        onChange={handleContentChanged}
                        value={content}
                      />
                    )
                  }
                
                </div>

                { isRecoding ? (
                  <button
                    type='button'
                    className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-semibold hover:text-slate-100'
                    onClick={handleStopReconding}
                >
                  <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                  Gravando (click p/ interromper)
                </button>
                ) : (
                  <button
                    type='button'
                    className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-semibold hover:bg-lime-500'
                    onClick={handleSaveNote}                    
                  >
                    Salve nota
                  </button>
                )}

              </form>
          </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
      
  )
}