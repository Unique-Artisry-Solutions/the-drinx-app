
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface AudienceSegmentFormProps {
  onSubmit: (data: { name: string; description: string }) => void;
  onCancel: () => void;
}

export const AudienceSegmentForm: React.FC<AudienceSegmentFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="segment-name">Segment Name</Label>
        <Input
          id="segment-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter segment name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="segment-description">Description</Label>
        <Textarea
          id="segment-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter segment description"
          rows={3}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Create Segment</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AudienceSegmentForm;
