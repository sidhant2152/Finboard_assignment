"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { AddWidgetModal } from "./AddWidgetModal";

const AddWidgetAction = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <>
      <Button
        variant={"default"}
        onClick={handleOpenChange}
        size="sm"
        className="px-2 sm:px-4"
      >
        <span className="hidden sm:inline">Add Widget</span>
        <span className="sm:hidden">Add</span>
      </Button>
      <AddWidgetModal open={isOpen} onOpenChange={handleOpenChange} />
    </>
  );
};

export default AddWidgetAction;
