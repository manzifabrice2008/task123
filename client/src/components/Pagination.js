import React from 'react';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const items = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);

    if (start > 1) {
      items.push(1);
      if (start > 2) items.push('...');
    }

    for (let i = start; i <= end; i++) {
      items.push(i);
    }

    if (end < pages) {
      if (end < pages - 1) items.push('...');
      items.push(pages);
    }

    return items;
  };

  return (
    <nav>
      <ul className="pagination pagination-sm justify-content-center mt-3">
        <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            Previous
          </button>
        </li>
        {getPages().map((p, i) => (
          <li key={i} className={`page-item ${p === page ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => typeof p === 'number' && onPageChange(p)}
            >
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item ${page >= pages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)} disabled={page >= pages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
