'use client';

import React, { useEffect, useState, useRef } from 'react';
import { textVariables, VariableCategory } from '@/lib/fabric/variables';

interface VariableAutocompleteProps {
  x: number;
  y: number;
  query: string;
  onSelect: (variableId: string) => void;
  onClose: () => void;
}

export default function VariableAutocomplete({
  x,
  y,
  query,
  onSelect,
  onClose,
}: VariableAutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter variables based on query
  const filteredVariables = textVariables.filter((v) =>
    v.id.toLowerCase().includes(query.toLowerCase()) ||
    v.label.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const groupedVariables = filteredVariables.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<VariableCategory, typeof textVariables>);

  // Flatten for keyboard navigation
  const flattenedOptions = Object.values(groupedVariables).flat();

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard events globally capturing them to intercept fabric canvas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flattenedOptions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % flattenedOptions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) =>
          prev === 0 ? flattenedOptions.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        onSelect(flattenedOptions[selectedIndex].id);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    // Capture phase so we intercept before canvas/others handle it
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [flattenedOptions, selectedIndex, onSelect, onClose]);

  // Scroll into view logic
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Handle click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Small timeout to allow click within canvas to not trigger immediate close if it was on a variable text,
      // but typically we can just close on any mousedown target not in the menu.
      const el = listRef.current;
      if (el && !el.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  if (filteredVariables.length === 0) {
    return null; // hide if no matches
  }

  let globalIndex = 0;

  return (
    <div
      ref={listRef}
      className="absolute z-[200] max-h-64 w-64 overflow-y-auto rounded-lg bg-white shadow-2xl border border-gray-200 text-sm animate-in fade-in zoom-in-95 duration-100"
      style={{
        left: x + 10, // slight offset from cursor
        top: y + 20,
      }}
      onMouseDown={(e) => {
         // Prevent taking blur away from text area
         e.preventDefault();
      }}
    >
      {Object.entries(groupedVariables).map(([category, items]) => (
        <div key={category}>
          <div className="bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide sticky top-0">
            {category}
          </div>
          {items.map((item) => {
            const isSelected = globalIndex === selectedIndex;
            const currentIndex = globalIndex++;
            return (
              <div
                key={item.id}
                data-selected={isSelected}
                className={`flex items-center justify-between cursor-pointer px-3 py-2 transition-colors ${
                  isSelected ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600' : 'text-gray-700 hover:bg-gray-100 border-l-2 border-transparent'
                }`}
                onMouseEnter={() => setSelectedIndex(currentIndex)}
                onMouseDown={(e) => {
                    e.preventDefault(); // prevent blur
                    onSelect(item.id);
                }}
              >
                <span>{item.label}</span>
                <span className={`text-xs ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>{`{{${item.id}}}`}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
