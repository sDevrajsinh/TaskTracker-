// src/components/dashboard/QuoteCard.jsx
import { useState } from 'react';
import { getRandomQuote } from '../../utils/quotes';

export default function QuoteCard() {
  const [quote] = useState(() => getRandomQuote());

  return (
    <section className="quote-card">
      <div className="quote-content">
        <p className="quote-text" id="quote-text">"{quote.text}"</p>
        <p className="quote-author" id="quote-author">— {quote.author}</p>
      </div>
    </section>
  );
}
