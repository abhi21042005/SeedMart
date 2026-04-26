import { useState } from 'react';
import { FiStar, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { addReview } from '../services/api';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      setLoading(true);
      const { data } = await addReview(productId, { rating, comment });
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      if (onReviewAdded) onReviewAdded(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form" style={{
      background: 'var(--color-bg-alt)',
      padding: '1.5rem',
      borderRadius: 'var(--radius-lg)',
      marginBottom: '1.5rem',
    }}>
      <h4 style={{ marginBottom: '1rem', fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
        Write a Review
      </h4>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: star <= (hoverRating || rating) ? 'var(--color-accent)' : '#CBD5E0',
              transition: 'color 150ms',
              padding: '2px',
            }}
          >
            <FiStar size={24} fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'} />
          </button>
        ))}
        <span style={{ marginLeft: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', alignSelf: 'center' }}>
          {rating > 0 ? `${rating}/5` : 'Select rating'}
        </span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={3}
        style={{ marginBottom: '1rem', resize: 'vertical' }}
        maxLength={500}
      />

      <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
        <FiSend size={14} />
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
