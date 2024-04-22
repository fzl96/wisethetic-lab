interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-destructive/25 p-3 text-sm text-destructive">
      {message}
    </div>
  );
}
