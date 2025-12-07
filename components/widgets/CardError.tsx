import React from "react";

interface CardErrorProps {
  message: string;
}

export const CardError = ({ message }: CardErrorProps) => {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
};
