type TextInputFilterProps = {
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
};

export function TextInputFilter(props: TextInputFilterProps) {
  const { onChange, value, placeholder } = props;

  return (
    <input
      type="text"
      className="form-control"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
    />
  );
}
