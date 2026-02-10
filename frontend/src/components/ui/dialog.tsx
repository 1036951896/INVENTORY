import type { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  children: ReactNode;
}

export function Dialog({ open, children }: DialogProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-auto">
            {children}
          </div>
        </div>
      )}
    </>
  );
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export function DialogContent({ children, className = '' }: DialogContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface DialogHeaderProps {
  children: ReactNode;
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return <div className="flex items-center justify-between mb-4">{children}</div>;
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return <h2 className={`text-2xl font-bold text-[#386273] ${className}`}>{children}</h2>;
}

interface DialogFooterProps {
  children: ReactNode;
}

export function DialogFooter({ children }: DialogFooterProps) {
  return <div className="mt-6 flex gap-3 justify-end border-t pt-4">{children}</div>;
}
