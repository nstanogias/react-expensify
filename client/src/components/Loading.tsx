const Loading: React.FC<{ center: boolean }> = ({ center }) => {
  return <div className={center ? 'loading loading-center' : 'loading'}></div>;
};

export default Loading;
