
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Hash, Instagram, Facebook, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";

interface SocialSharingOptionsProps {
  hashtags: string[];
  onHashtagsChange: (hashtags: string[]) => void;
}

const SocialSharingOptions: React.FC<SocialSharingOptionsProps> = ({ hashtags, onHashtagsChange }) => {
  const [newHashtag, setNewHashtag] = useState('');

  const handleAddHashtag = () => {
    const formatted = newHashtag.trim().replace(/^#/, '');
    
    if (!formatted) return;
    if (hashtags.includes(formatted)) {
      toast.error("This hashtag already exists");
      return;
    }
    
    onHashtagsChange([...hashtags, formatted]);
    setNewHashtag('');
  };

  const handleRemoveHashtag = (tag: string) => {
    onHashtagsChange(hashtags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Social Sharing</h3>
        <p className="text-sm text-muted-foreground">
          Create custom hashtags to promote your Swig Circuit on social media
        </p>
      </div>
      
      <div className="flex gap-2 items-center">
        <Hash size={18} className="text-muted-foreground" />
        <Input
          value={newHashtag}
          onChange={(e) => setNewHashtag(e.target.value)}
          placeholder="Add a hashtag (without #)"
          className="flex-1"
        />
        <Button type="button" size="sm" onClick={handleAddHashtag}>
          Add
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {hashtags.map(tag => (
          <Badge 
            key={tag} 
            variant="secondary"
            className="px-2 py-1.5 text-sm"
          >
            #{tag}
            <button
              className="ml-2 text-muted-foreground hover:text-foreground"
              onClick={() => handleRemoveHashtag(tag)}
            >
              &times;
            </button>
          </Badge>
        ))}
        {hashtags.length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No hashtags added yet
          </p>
        )}
      </div>
      
      <div className="mt-4 bg-muted/20 p-4 rounded-lg border">
        <Label className="block mb-2">Platforms to share on:</Label>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Instagram size={16} className="text-pink-500" />
            Instagram
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Facebook size={16} className="text-blue-600" />
            Facebook
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Twitter size={16} className="text-blue-400" />
            Twitter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialSharingOptions;
