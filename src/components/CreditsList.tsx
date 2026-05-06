import React from 'react';
import { Credit } from '../types';

const CreditsList: React.FC<{ credits?: Credit[] }> = ({ credits = [] }) => {
  if (!credits.length) return null;

  return (
    <div style={{ marginTop: 12, color: '#ddd', maxWidth: 720, margin: '12px auto' }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: 12, textTransform: 'uppercase', color: '#bdbdbd', letterSpacing: '0.12em' }}>
        Credits
      </h4>

      <dl style={{ margin: 0 }}>
        {credits.map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <dt style={{ fontSize: 12, color: '#bdbdbd', textTransform: 'uppercase' }}>{c.role}</dt>
            <dd style={{ margin: 0, fontSize: 14, color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>{c.name}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default CreditsList;