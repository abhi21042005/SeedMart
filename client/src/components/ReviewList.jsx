import { FiStar, FiUser } from 'react-icons/fi';

const ReviewList = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--color-text-muted)',
      }}>
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="review-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {reviews.map((review) => (
        <div
          key={review._id}
          style={{
            background: 'var(--color-bg-card)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #F0F0F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}>
                {review.userId?.name?.charAt(0)?.toUpperCase() || <FiUser size={14} />}
              </div>
              <div>
                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                  {review.userId?.name || 'Anonymous'}
                </p>
                <div className="stars" style={{ fontSize: '0.75rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      size={12}
                      className={star <= review.rating ? '' : 'star-empty'}
                      fill={star <= review.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
              {new Date(review.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
