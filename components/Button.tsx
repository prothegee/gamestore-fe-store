'use client';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
};

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false
}: ButtonProps) {
  const baseStyles = "px-6 py-2 font-medium rounded transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 uppercase text-sm tracking-wider";

  const variants = {
    primary: "bg-steam-button hover:bg-steam-button-hover text-white shadow-lg",
    secondary: "bg-steam-dark hover:bg-steam-light hover:text-steam-darkest text-steam-text",
    outline: "border border-steam-light text-steam-light hover:bg-steam-light hover:text-steam-darkest"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
