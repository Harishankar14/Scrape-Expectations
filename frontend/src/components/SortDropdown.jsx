// components/CustomSortDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { SORT_OPTIONS } from '../hooks/sortProducts';
import './CustomSortDropdown.css';

const OPTIONS = [
  { value: '', label: 'Default Sorting' },
  { value: SORT_OPTIONS.PRICE_LOW_HIGH, label: 'Price: Low to High' },
  { value: SORT_OPTIONS.PRICE_HIGH_LOW, label: 'Price: High to Low' },
  { value: SORT_OPTIONS.SOURCE_A_Z, label: 'Source: A to Z' },
  { value: SORT_OPTIONS.SOURCE_Z_A, label: 'Source: Z to A' },
];

export default function CustomSortDropdown({ currentSort, onSortChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeOption = OPTIONS.find((opt) => opt.value === currentSort) || OPTIONS[0];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-sort-wrapper" ref={dropdownRef} >
      <button
        type="button"
        className={`sort-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{background: 'var(--gradient-neon)'}}
      >
        <span style={{color: '#fff'}}>Sort: {activeOption.label}</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <ul className="sort-menu" style={{background: 'var(--gradient-neon)', }}>
          {OPTIONS.map((opt) => (
            <li
              key={opt.value}
              className={`sort-menu-item ${currentSort === opt.value ? 'selected' : ''}`}
              onClick={() => {
                onSortChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
              {currentSort === opt.value && <span className="checkmark">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}