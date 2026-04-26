import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="error-message" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      gap: '1rem',
      textAlign: 'center',
    }}>
      <FiAlertCircle size={48} color="var(--color-error)" />
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
