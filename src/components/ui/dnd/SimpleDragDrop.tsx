
import React, { useState, useRef, useEffect } from 'react';

export interface DraggableProps {
  draggableId: string;
  index: number;
  children: (provided: {
    draggableProps: any;
    dragHandleProps: any;
    innerRef: React.RefObject<any>;
  }) => React.ReactNode;
}

export interface DroppableProps {
  droppableId: string;
  children: (provided: {
    droppableProps: any;
    innerRef: React.RefObject<any>;
    placeholder: React.ReactNode;
  }) => React.ReactNode;
}

export interface DragDropContextProps {
  onDragEnd: (result: { source: { index: number }; destination?: { index: number } }) => void;
  children: React.ReactNode;
}

// Simple context to manage drag state
const DragDropContext = React.createContext<{
  onDragEnd: (result: { source: { index: number }; destination?: { index: number } }) => void;
}>({
  onDragEnd: () => {}
});

export const Draggable: React.FC<DraggableProps> = ({ draggableId, index, children }) => {
  const ref = useRef<HTMLElement>(null);
  
  const draggableProps = {
    'data-draggable-id': draggableId,
    'data-index': index,
    style: { position: 'relative' as const }
  };
  
  const dragHandleProps = {
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', `${draggableId}:${index}`);
      e.dataTransfer.effectAllowed = 'move';
      
      if (e.currentTarget instanceof HTMLElement) {
        setTimeout(() => {
          e.currentTarget.style.opacity = '0.5';
        }, 0);
      }
    },
    onDragEnd: (e: React.DragEvent) => {
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = '1';
      }
    },
    style: { cursor: 'grab' }
  };
  
  return <>{children({ draggableProps, dragHandleProps, innerRef: ref })}</>;
};

export const Droppable: React.FC<DroppableProps> = ({ droppableId, children }) => {
  const ref = useRef<HTMLElement>(null);
  const { onDragEnd } = React.useContext(DragDropContext);
  
  const droppableProps = {
    'data-droppable-id': droppableId,
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const data = e.dataTransfer.getData('text/plain');
      const [draggableId, sourceIndex] = data.split(':');
      
      // Find the target index by looking at the drop position
      let targetIndex = parseInt(sourceIndex);
      
      if (ref.current) {
        const children = Array.from(ref.current.children);
        const rect = ref.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        
        // Find the element we're dropping onto
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const childRect = child.getBoundingClientRect();
          const childMidpoint = childRect.top + childRect.height / 2 - rect.top;
          
          if (y <= childMidpoint) {
            targetIndex = i;
            break;
          } else if (i === children.length - 1) {
            targetIndex = children.length;
          }
        }
      }
      
      onDragEnd({
        source: { index: parseInt(sourceIndex) },
        destination: { index: targetIndex }
      });
    },
    style: { position: 'relative' as const }
  };
  
  return <>{children({ droppableProps, innerRef: ref, placeholder: null })}</>;
};

export const DragDropContext: React.FC<DragDropContextProps> = ({ onDragEnd, children }) => {
  const contextValue = { onDragEnd };
  
  return (
    <DragDropContext.Provider value={contextValue}>
      {children}
    </DragDropContext.Provider>
  );
};
