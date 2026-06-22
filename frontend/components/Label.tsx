export default function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {children}
      {required && <span className="ml-1 text-amber-600">*</span>}
    </label>
  );
}
