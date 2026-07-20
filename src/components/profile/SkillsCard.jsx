import React, { useState } from 'react';
import { Sparkles, X, Plus, Search } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Go', 'Java',
  'Tailwind CSS', 'HTML5', 'CSS3', 'Next.js', 'Vue.js', 'Angular', 'Zustand',
  'Redux', 'Express', 'FastAPI', 'Django', 'PostgreSQL', 'MongoDB', 'Firebase',
  'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'REST APIs', 'GraphQL',
  'Git', 'CI/CD', 'Agile', 'System Design', 'Testing', 'Jest', 'UI/UX'
];

export const SkillsCard = ({ watch, setValue }) => {
  const skills = watch('skills') || [];
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (!trimmedSkill) return;

    // Avoid duplicates (case-insensitive check)
    const exists = skills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase());
    if (!exists) {
      const updatedSkills = [...skills, trimmedSkill];
      setValue('skills', updatedSkills, { shouldDirty: true });
    }
    setInputValue('');
  };

  const removeSkill = (indexToRemove) => {
    const updatedSkills = skills.filter((_, idx) => idx !== indexToRemove);
    setValue('skills', updatedSkills, { shouldDirty: true });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  // Filter suggestion list based on input value and already added skills
  const filteredSuggestions = SUGGESTED_SKILLS.filter(skill => 
    skill.toLowerCase().includes(inputValue.toLowerCase()) &&
    !skills.some(s => s.toLowerCase() === skill.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs transition-colors duration-200 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-base">Skills</h3>
      </div>

      {/* Input container */}
      <div className="relative flex flex-col gap-1.5">
        <label htmlFor="skillInput" className="text-sm font-medium text-slate-705 dark:text-slate-350">
          Search or Add Skills
        </label>
        
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            id="skillInput"
            type="text"
            placeholder="Search popular skills, or type a custom one & press Enter..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay to allow clicks
            className="w-full pl-9 pr-24 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-sm transition-custom focus-ring bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
          
          <button
            type="button"
            onClick={() => addSkill(inputValue)}
            className="absolute right-2 px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>

        {/* Suggestion Dropdown */}
        {isFocused && inputValue.trim() !== '' && filteredSuggestions.length > 0 && (
          <div className="absolute top-[68px] z-10 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg overflow-hidden transition-all duration-200">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={() => addSkill(suggestion)}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chip UI container */}
      <div className="flex flex-wrap gap-2.5 pt-2">
        {skills.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">
            No skills added yet. Type and press enter to display skill chips.
          </p>
        ) : (
          skills.map((skill, index) => (
            <div
              key={`${skill}-${index}`}
              className="inline-flex items-center gap-1.5 bg-brand-50/50 dark:bg-brand-950/20 text-brand-800 dark:text-brand-405 border border-brand-100 dark:border-brand-900/30 pl-3 pr-2 py-1 rounded-full text-xs font-semibold select-none group hover:border-brand-300 transition-colors"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-brand-100/50 dark:hover:bg-brand-900/50 rounded-full p-0.5 transition-colors cursor-pointer"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Popular Suggestions list (when input is empty) */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-450 dark:text-slate-400">
          Suggested Skills:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SKILLS.slice(0, 10).map((skill) => {
            const hasSkill = skills.some(s => s.toLowerCase() === skill.toLowerCase());
            if (hasSkill) return null;
            return (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="px-2.5 py-1 text-2xs bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-350 hover:bg-brand-50 hover:dark:bg-brand-950/20 hover:text-brand-700 border border-slate-200 dark:border-slate-800 rounded-md transition-colors cursor-pointer"
              >
                + {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
