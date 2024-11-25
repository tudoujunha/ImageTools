interface Props {
  message: string;
}

export function StatusDisplay({ message }: Props) {
  if (!message) return null;
  
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <p className="whitespace-pre-wrap">{message}</p>
    </div>
  );
} 