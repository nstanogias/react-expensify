const FormRow: React.FC<{
  type: string;
  name: string;
  value: string | number | undefined;
  handleChange: (e: any) => void;
  labelText?: string;
}> = ({ type, name, value, handleChange, labelText }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className="form-input"
      />
    </div>
  );
};

export default FormRow;
