'use client';

interface DeleteButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function DeleteButton({ children, className }: DeleteButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      event.preventDefault();
    }
  };

  return (
    <button type="submit" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
