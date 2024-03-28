import React, { useEffect, useState } from 'react';


function App() {
  type Note = {
    id:number;
    title:string;
    content:string
  }
  const [notes,setNotes] = useState<Note[]>([]);

  const [title,setTitle] = useState("");
  const [content,setContent] = useState("");
  const [selectedNote,setSelectedNote] = useState<Note | null>(null); 

  useEffect(()=>{
    const fetchNotes = async()=>{
      try{
        const res = await fetch("http://localhost:5000/api/notes/");
        const resp = await res.json();
        setNotes(resp);
      }catch(err){
        console.log(err);
      }
    }
    fetchNotes();
  },[]);

  const handleAddNote =async(event:React.FormEvent)=>{
    event.preventDefault();
    
    //without api call
    // const newNote:Note = {
    //   id: notes.length + 1,
    //   title: title,
    //   content:content
    // };

    try{
      let response = await fetch("http://localhost:5000/api/notes/",{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({
          title,
          content
        })
      });
      let newNote = await response.json();
      setNotes([newNote,...notes]);
    setTitle("");
    setContent("");
    }catch(err){
      console.log(err)
    }
    
  }

  const onNoteClick = (note:Note)=>{

      setSelectedNote(note);
      setTitle(note.title);
      setContent(note.content);
  }

  const handleSaveNote = async(event:React.FormEvent)=>{
    event.preventDefault();
    if(!selectedNote){
      return;
    }

    // const updatedNote:Note = {
    //   id: selectedNote.id,
    //   title: title,
    //   content:content
    // }

   try{
    let resp = await fetch(`http://localhost:5000/api/notes/${selectedNote.id}`,{
      method:"PUT",
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify({
        title,
        content
      })
    });
    const updatedNote = await resp.json();
    const updatedNotes = notes.map((note)=>{
      return note.id === selectedNote.id ? updatedNote:note
    });

    setNotes(updatedNotes);
    setTitle("");
    setContent("");
    setSelectedNote(null);
   }catch(err){
console.log(err)
   }
  }

  const handleCancel = ()=>{
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  const deleteNote = async(event:React.MouseEvent,noteId:number) =>{
    event.stopPropagation();
    try{
      await fetch(`http://localhost:5000/api/notes/${noteId}`,{
        method:"DELETE"
      })
      const updatedNotes = notes.filter((note)=> note.id !== noteId);
      setNotes(updatedNotes);
    }catch(err){
      console.log(err);
    }
    
  }
  return (
    <div className='note-container grid grid-cols-[auto_1fr] ml-2 mt-6 mr-4 mb-8 '>
      <form className='mr-4 flex flex-col gap-5' onSubmit={selectedNote ? handleSaveNote: handleAddNote}>
          <input 
          value={title}
          onChange={(event)=> {
            setTitle(event.target.value);
          }}
          placeholder='Title' 
          className='block bg-white border border-slate-300 rounded-md placeholder:italic  px-2 py-1 w-full'
          />
          <textarea 
          value={content}
          onChange={(event)=> {
            setContent(event.target.value);
          }}
          placeholder='content'
          className='block bg-white border border-slate-300 rounded-md placeholder:italic  px-2 py-1 w-full'/>
          {
            selectedNote ? <div ><button className='bg-sky-400 px-4 py-1 mr-2 rounded-full text-sm font-semibold text-white' disabled={title.length && content?.length ? false: true}>Save</button>
            <button className='bg-red-500 px-4 py-1 rounded-full text-sm font-semibold text-white' onClick={handleCancel}>Cancel</button></div>:<button className='bg-sky-400 px-4 py-1 rounded-full text-sm font-semibold text-white' disabled={title.length && content?.length ? false: true}>Add Note</button>
          }
      </form>
      <div className='note-grids grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 auto-rows-[minmax(250px,auto)]'>
        {
          notes.map((item)=>
          <div className='note-item flex flex-col border border-solid rounded border-slate-100 bg-slate-100 shadow cursor-pointer' key={item.id} onClick={()=>onNoteClick(item)}>
          <div className='note-header flex justify-end '>
            <button className='close-button text-base bg-transparent cursor-pointer max-w-fit' onClick={(event)=>deleteNote(event,item.id)}>x</button>
          </div>
          <div className='note-title font-bold'>{item.title}</div>
          <div className='note-content'>
          {item.content}
          </div>
        </div>
          )
        }
        
      </div>
    </div>
  );
}

export default App;
