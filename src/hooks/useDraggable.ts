import { useEffect, useRef, useState } from "react";

export interface UseDraggableOptions {
  id: string;
  /** Если false, перетаскивание без зажатого Alt */
  requireAlt?: boolean;
  /** Границы: элемент не уйдёт за пределы (в пикселях от начальной позиции или экрана) */
  bounds?: { minX?: number; maxX?: number; minY?: number; maxY?: number };
}

interface Position {
  x: number;
  y: number;
}

interface DraggableResult {
  style: React.CSSProperties;
  eventHandlers: {
    onMouseDown: (event: React.MouseEvent) => void;
    onTouchStart: (event: React.TouchEvent) => void;
  };
}

function clampPosition(
  pos: Position,
  bounds?: { minX?: number; maxX?: number; minY?: number; maxY?: number }
): Position {
  if (!bounds) return pos;
  let x = pos.x;
  let y = pos.y;
  if (bounds.minX != null && x < bounds.minX) x = bounds.minX;
  if (bounds.maxX != null && x > bounds.maxX) x = bounds.maxX;
  if (bounds.minY != null && y < bounds.minY) y = bounds.minY;
  if (bounds.maxY != null && y > bounds.maxY) y = bounds.maxY;
  return { x, y };
}

export function useDraggable(options: UseDraggableOptions): DraggableResult {
  const { id, requireAlt = true, bounds } = options;
  const [position, setPosition] = useState<Position>(() => {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    try {
      const raw = window.localStorage.getItem(`crash-draggable:${id}`);
      if (!raw) return { x: 0, y: 0 };
      const parsed = JSON.parse(raw) as Position;
      const pos = { x: parsed.x ?? 0, y: parsed.y ?? 0 };
      return clampPosition(pos, bounds);
    } catch {
      return { x: 0, y: 0 };
    }
  });

  const draggingRef = useRef(false);
  const startRef = useRef<{ x: number; y: number; baseX: number; baseY: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(`crash-draggable:${id}`, JSON.stringify(position));
  }, [id, position]);

  const updatePosition = (clientX: number, clientY: number) => {
    if (!startRef.current) return;
    const { x, y, baseX, baseY } = startRef.current;
    const next = { x: baseX + (clientX - x), y: baseY + (clientY - y) };
    setPosition(clampPosition(next, bounds));
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!draggingRef.current || !startRef.current) return;
      updatePosition(event.clientX, event.clientY);
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
      startRef.current = null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!draggingRef.current || !startRef.current || !event.touches[0]) return;
      event.preventDefault();
      updatePosition(event.touches[0].clientX, event.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      draggingRef.current = false;
      startRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  const startDrag = (clientX: number, clientY: number) => {
    draggingRef.current = true;
    startRef.current = {
      x: clientX,
      y: clientY,
      baseX: position.x,
      baseY: position.y
    };
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (requireAlt && !event.altKey) return;
    event.preventDefault();
    startDrag(event.clientX, event.clientY);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    if (!event.touches[0]) return;
    event.preventDefault();
    startDrag(event.touches[0].clientX, event.touches[0].clientY);
  };

  return {
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      cursor: "grab",
      touchAction: "none"
    },
    eventHandlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart
    }
  };
}

