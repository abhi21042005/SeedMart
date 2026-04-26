import './Loader.css';

const Loader = ({ size = 'default', text = '' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-spinner">
        <div className="leaf leaf-1"></div>
        <div className="leaf leaf-2"></div>
        <div className="leaf leaf-3"></div>
        <div className="leaf leaf-4"></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
