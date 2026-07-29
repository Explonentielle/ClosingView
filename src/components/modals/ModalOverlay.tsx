import type { CSSProperties, ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface ModalOverlayProps {
  open: boolean;
  onClose: () => void;
  overlayId?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  children: ReactNode;
}

/**
 * Shared Radix Dialog wiring for this app's hand-styled modals.
 * Radix's DismissableLayer only treats an interaction as "outside" when it
 * *starts* (pointerdown) outside the content — unlike a plain onClick
 * overlay handler, it isn't fooled by a text selection dragged past the
 * modal's edge before the mouse is released.
 *
 * Content is nested inside Overlay (rather than Radix's sibling anatomy) so
 * the existing flex-centering + padding on the overlay keeps working
 * unchanged for every caller.
 */
export const ModalOverlay = ({
  open,
  onClose,
  overlayId,
  overlayClassName,
  overlayStyle,
  contentClassName,
  contentStyle,
  children,
}: ModalOverlayProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay id={overlayId} className={overlayClassName} style={overlayStyle}>
        <DialogPrimitive.Content className={contentClassName} style={contentStyle} aria-describedby={undefined}>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);
