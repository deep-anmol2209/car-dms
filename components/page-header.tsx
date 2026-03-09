'use client';

import React from "react";

interface PageHeaderProps {
  title: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
  };
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>

      {action && (
        <button
          type="button"              // ✅ important
          onClick={action.onClick}   // ✅ THIS WAS MISSING
          disabled={action.disabled}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </button>
      )}
    </div>
  );
}
