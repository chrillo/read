export const FormCheckbox = ({
	label,
	name,
	defaultValue,
	value,
}: {
	value?: string;
	label: string;
	name: string;
	defaultValue?: boolean;
}) => {
	const props = value ? { value } : {};
	return (
		<label className="form-checkbox">
			<span className="form-input-label">{label}</span>
			<input type="checkbox" defaultChecked={defaultValue} {...props} name={name} />
		</label>
	);
};
