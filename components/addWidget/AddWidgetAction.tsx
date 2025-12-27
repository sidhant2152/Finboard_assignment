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
      <Button variant={"default"} onClick={handleOpenChange}>
        Add Widget
      </Button>
      <AddWidgetModal open={isOpen} onOpenChange={handleOpenChange} />
    </>
  );
};

export default AddWidgetAction;
