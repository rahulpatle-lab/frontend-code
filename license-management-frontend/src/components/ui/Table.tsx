import React from 'react';
import { clsx } from 'clsx';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

export const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className={clsx('min-w-full divide-y divide-gray-300', className)}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return (
    <thead className={clsx('bg-gray-50', className)}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return (
    <tbody className={clsx('bg-white divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => {
  return (
    <tr
      className={clsx(
        'hover:bg-gray-50',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const TableCell: React.FC<TableCellProps> = ({ children, className, colSpan }) => {
  return (
    <td
      className={clsx('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

export const TableHeaderCell: React.FC<TableCellProps> = ({ children, className }) => {
  return (
    <th
      className={clsx('px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', className)}
    >
      {children}
    </th>
  );
};
