
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Save } from 'lucide-react';
import { useDraftPersistence } from '@/hooks/messages/useDraftPersistence';

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
  threadId?: string;
  onEscape?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled,
  threadId = 'default',
  onEscape,
  placeholder = "Type your message...",
  autoFocus = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sending, setSending] = useState(false);
  const { draft, saveDraft, clearDraft } = useDraftPersistence(threadId);

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSendMessage = useCallback(async () => {
    if (!draft.trim() || sending) return;
    
    setSending(true);
    try {
      await onSendMessage(draft.trim());
      clearDraft();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  }, [draft, sending, onSendMessage, clearDraft]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
    }
  }, [handleSendMessage, onEscape]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    saveDraft(e.target.value);
  }, [saveDraft]);

  return (
    <div className="p-4 pt-0">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] pr-10"
            disabled={disabled || sending}
            aria-label="Message input"
            aria-describedby="message-help"
          />
          {draft && !sending && (
            <div className="absolute bottom-2 right-2 opacity-50">
              <Save className="h-3 w-3" />
            </div>
          )}
          <div id="message-help" className="sr-only">
            Press Enter to send, Shift+Enter for new line, Escape to close
          </div>
        </div>
        <Button 
          onClick={handleSendMessage} 
          disabled={sending || !draft.trim() || disabled}
          className="self-end"
          aria-label={sending ? "Sending message..." : "Send message"}
        >
          <Send className="h-4 w-4 mr-2" />
          {sending ? "Sending..." : "Send"}
        </Button>
      </div>
      {draft && (
        <div className="text-xs text-muted-foreground mt-1">
          Draft saved • Press Enter to send, Escape to close
        </div>
      )}
    </div>
  );
};

export default MessageInput;
