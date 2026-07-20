import React, { useState, useEffect } from 'react';
import { Plus, Pin, Trash2, Edit, Save, FileText, CheckCircle, Code } from 'lucide-react';
import { useInterviewStore } from '../../store/interviewStore';

export const NotesView = () => {
  const { company, notes, setNotes } = useInterviewStore();

  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (notes.length === 0) {
      const defaultNotes = [
        {
          id: 'n1',
          title: `${company} Preparation Strategy`,
          content: `- Focus on role-specific technical skills.\n- Practice live coding in timed environments.\n- Review system design patterns and scalability concepts.`,
          pinned: true,
          updatedAt: new Date().toLocaleDateString()
        },
        {
          id: 'n2',
          title: 'Key Concepts to Review',
          content: `// Add your notes here\n- Review past projects\n- Practice behavioral questions\n- Study company-specific patterns`,
          pinned: false,
          updatedAt: new Date().toLocaleDateString()
        }
      ];
      setNotes(defaultNotes);
    }
  }, []);

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  const handleCreateNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: '',
      pinned: false,
      updatedAt: new Date().toLocaleDateString()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    handleSelectNote(newNote);
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (!selectedNote) return;
    const updated = notes.map(n =>
      n.id === selectedNote.id
        ? { ...n, title, content, updatedAt: new Date().toLocaleDateString() }
        : n
    );
    setNotes(updated);
    setIsEditing(false);

    const current = updated.find(n => n.id === selectedNote.id);
    setSelectedNote(current);
  };

  const handleDeleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
      setTitle('');
      setContent('');
      setIsEditing(false);
    }
  };

  const handleTogglePin = (id, e) => {
    e.stopPropagation();
    const updated = notes.map(n =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    );
    const sorted = [...updated].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    setNotes(sorted);

    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(sorted.find(n => n.id === id));
    }
  };

  const insertSnippet = (snippet) => {
    setContent(prev => prev + '\n' + snippet);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Notes</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Store code snippets, checklist goals, and draft preparation templates for {company}.
          </p>
        </div>
        <button
          onClick={handleCreateNote}
          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" /> Create Note
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2.5 md:col-span-1 border-r border-slate-100 dark:border-slate-850 pr-0 md:pr-4">
          <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-550 tracking-wider block mb-2">My Saved Notes</span>

          {notes.length === 0 ? (
            <p className="text-xs text-slate-405 py-4 text-center">No notes saved yet.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {notes.map(note => {
                const isActive = selectedNote?.id === note.id;

                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex justify-between items-start gap-2 ${
                      isActive
                        ? 'bg-slate-100/80 border-slate-300 dark:bg-slate-800 dark:border-slate-700'
                        : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <span className={`text-xs font-bold truncate block ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-250'}`}>
                        {note.title || 'Untitled note'}
                      </span>
                      <span className="text-[9px] text-slate-405 block">{note.updatedAt}</span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(note.id, e)}
                        className={`p-1 rounded transition-colors ${
                          note.pinned
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                        title={note.pinned ? 'Unpin note' : 'Pin note'}
                      >
                        <Pin className={`h-3 w-3 ${note.pinned ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 md:p-6 shadow-3xs">
          {selectedNote ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-850">
                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-sm font-bold text-slate-900 dark:text-white bg-transparent border-b border-brand-500 focus:outline-hidden pr-2 w-full max-w-sm"
                  />
                ) : (
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title || 'Untitled Note'}</h3>
                )}

                <div className="flex gap-2.5">
                  {isEditing ? (
                    <button
                      onClick={handleSaveNote}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Save className="h-3 w-3" /> Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer text-slate-655 dark:text-slate-350 transition-colors"
                    >
                      <Edit className="h-3 w-3" /> Edit
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2 items-center bg-slate-50 dark:bg-slate-950 p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg max-w-full overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => insertSnippet("- [ ] ")}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-350 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                      title="Checkbox"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Todo
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet("```javascript\n\n```")}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-350 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                      title="Code Block"
                    >
                      <Code className="h-3.5 w-3.5" /> JS Template
                    </button>
                  </div>

                  <textarea
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg text-xs leading-relaxed font-mono placeholder-slate-400 dark:placeholder-slate-550 focus:outline-hidden"
                    placeholder="Enter note contents..."
                  />
                </div>
              ) : (
                <div className="min-h-[250px] whitespace-pre-line text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-lg border border-slate-100 dark:border-slate-850 select-text text-justify">
                  {content || 'No content entered. Click Edit to customize note.'}
                </div>
              )}
            </div>
          ) : (
            <div className="min-h-[300px] flex flex-col items-center justify-center text-slate-450 dark:text-slate-500 gap-2.5">
              <FileText className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-semibold">Select a note or click Create Note to write guidelines.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
