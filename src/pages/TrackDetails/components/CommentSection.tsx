import React, { useState } from 'react';

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

const CommentSection = ({ docId }: { docId: number }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleSend = () => {
    if (!newComment.trim()) return;
    // Logique d'envoi API ici
    setNewComment("");
  };

  return (
    <div className="comment-section" style={{ marginTop: '20px', padding: '15px', background: 'var(--background-light)', borderRadius: '12px' }}>
      <h4 style={{ marginBottom: '15px' }}>Commentaires sur le document</h4>
      <div className="comments-list" style={{ marginBottom: '15px' }}>
        {comments.length === 0 ? <p style={{ fontSize: '0.9rem', color: '#666' }}>Aucun commentaire pour le moment.</p> : 
          comments.map(c => (
            <div key={c.id} style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
              <strong>{c.author}</strong> <small>({c.date})</small>
              <p style={{ margin: '5px 0' }}>{c.text}</p>
            </div>
          ))
        }
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Écrire un commentaire..."
          style={{ marginBottom: 0 }}
        />
        <button onClick={handleSend} style={{ padding: '0.5rem 1rem', float: 'none' }}>Envoyer</button>
      </div>
    </div>
  );
};

export default CommentSection;