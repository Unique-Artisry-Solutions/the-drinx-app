
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  CalendarIcon, 
  Plus, 
  Trash2, 
  Edit, 
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  Release, 
  ReleaseType, 
  ReleaseStatus, 
  ReleaseFeature, 
  ReleaseNote, 
  ReleaseFeatureStatus 
} from '../types/releaseTypes';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { v4 as uuidv4 } from 'uuid';

interface ReleaseEditorProps {
  release: Release;
  onSave: (release: Release) => void;
  onDelete: (releaseId: string) => void;
  onCancel: () => void;
  onAddFeature: (feature: Omit<ReleaseFeature, "id">) => void;
}

const ReleaseEditor: React.FC<ReleaseEditorProps> = ({
  release,
  onSave,
  onDelete,
  onCancel,
  onAddFeature
}) => {
  const [editedRelease, setEditedRelease] = useState<Release>(release);
  const [activeTab, setActiveTab] = useState('details');
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newFeature, setNewFeature] = useState<Omit<ReleaseFeature, "id">>({
    name: '',
    description: '',
    status: 'pending',
    percentComplete: 0
  });
  const [newNote, setNewNote] = useState<Omit<ReleaseNote, "id">>({
    type: 'feature',
    title: '',
    description: '',
    userFacing: true
  });
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedFeature, setEditedFeature] = useState<ReleaseFeature | null>(null);
  const [editedNote, setEditedNote] = useState<ReleaseNote | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedRelease(prev => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString()
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setEditedRelease(prev => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString()
    }));
  };
  
  const handleSave = () => {
    onSave(editedRelease);
  };
  
  const handleDeleteDialogOpen = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    onDelete(editedRelease.id);
    setIsDeleteDialogOpen(false);
  };
  
  // Feature handling functions
  const handleAddFeatureClick = () => {
    setIsAddingFeature(true);
  };
  
  const handleNewFeatureInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFeature(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNewFeatureSelectChange = (name: string, value: string) => {
    setNewFeature(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNewFeatureSubmit = () => {
    const featureToAdd = {
      ...newFeature,
      startDate: newFeature.startDate || new Date().toISOString().split('T')[0]
    };
    
    // Call the parent component's onAddFeature
    onAddFeature(featureToAdd);
    
    // Reset form and close dialog
    setNewFeature({
      name: '',
      description: '',
      status: 'pending',
      percentComplete: 0
    });
    setIsAddingFeature(false);
  };
  
  // Feature editing functions
  const startEditingFeature = (feature: ReleaseFeature) => {
    setEditingFeatureId(feature.id);
    setEditedFeature({...feature});
  };
  
  const handleEditedFeatureChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedFeature) return;
    
    const { name, value } = e.target;
    setEditedFeature(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };
  
  const handleEditedFeatureSelectChange = (name: string, value: string) => {
    if (!editedFeature) return;
    
    setEditedFeature(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };
  
  const saveEditedFeature = () => {
    if (!editedFeature || !editingFeatureId) return;
    
    // Update the feature in the release
    const updatedFeatures = editedRelease.features.map(f => 
      f.id === editingFeatureId ? editedFeature : f
    );
    
    setEditedRelease(prev => ({
      ...prev,
      features: updatedFeatures,
      updatedAt: new Date().toISOString()
    }));
    
    // Reset editing state
    setEditingFeatureId(null);
    setEditedFeature(null);
  };
  
  const cancelEditingFeature = () => {
    setEditingFeatureId(null);
    setEditedFeature(null);
  };
  
  const deleteFeature = (featureId: string) => {
    const updatedFeatures = editedRelease.features.filter(f => f.id !== featureId);
    
    setEditedRelease(prev => ({
      ...prev,
      features: updatedFeatures,
      updatedAt: new Date().toISOString()
    }));
  };
  
  // Release notes handling functions
  const handleAddNoteClick = () => {
    setIsAddingNote(true);
  };
  
  const handleNewNoteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNote(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNewNoteSelectChange = (name: string, value: string | boolean) => {
    setNewNote(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNewNoteSubmit = () => {
    const noteToAdd: ReleaseNote = {
      id: `note-${uuidv4()}`,
      ...newNote,
      author: newNote.author || 'System',
      createdAt: new Date().toISOString()
    };
    
    // Add note to release
    setEditedRelease(prev => ({
      ...prev,
      releaseNotes: [...prev.releaseNotes, noteToAdd],
      updatedAt: new Date().toISOString()
    }));
    
    // Reset form and close dialog
    setNewNote({
      type: 'feature',
      title: '',
      description: '',
      userFacing: true
    });
    setIsAddingNote(false);
  };
  
  // Note editing functions
  const startEditingNote = (note: ReleaseNote) => {
    setEditingNoteId(note.id);
    setEditedNote({...note});
  };
  
  const handleEditedNoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedNote) return;
    
    const { name, value } = e.target;
    setEditedNote(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };
  
  const handleEditedNoteSelectChange = (name: string, value: string | boolean) => {
    if (!editedNote) return;
    
    setEditedNote(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };
  
  const saveEditedNote = () => {
    if (!editedNote || !editingNoteId) return;
    
    // Update the note in the release
    const updatedNotes = editedRelease.releaseNotes.map(n => 
      n.id === editingNoteId ? editedNote : n
    );
    
    setEditedRelease(prev => ({
      ...prev,
      releaseNotes: updatedNotes,
      updatedAt: new Date().toISOString()
    }));
    
    // Reset editing state
    setEditingNoteId(null);
    setEditedNote(null);
  };
  
  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditedNote(null);
  };
  
  const deleteNote = (noteId: string) => {
    const updatedNotes = editedRelease.releaseNotes.filter(n => n.id !== noteId);
    
    setEditedRelease(prev => ({
      ...prev,
      releaseNotes: updatedNotes,
      updatedAt: new Date().toISOString()
    }));
  };
  
  // Handle date selection
  const handleDateChange = (field: string, date: Date | undefined) => {
    if (!date) return;
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    setEditedRelease(prev => ({
      ...prev,
      [field]: formattedDate,
      updatedAt: new Date().toISOString()
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {editedRelease.id ? `Edit Release: ${editedRelease.version || 'New Release'}` : 'Create New Release'}
        </h2>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          
          {editedRelease.id && editedRelease.version && (
            <Button 
              variant="destructive"
              onClick={handleDeleteDialogOpen}
            >
              Delete
            </Button>
          )}
          
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Release
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="details">Basic Details</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="notes">Release Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="version">Version Number</Label>
                <Input
                  id="version"
                  name="version"
                  value={editedRelease.version}
                  onChange={handleInputChange}
                  placeholder="e.g. 1.2.0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Release Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editedRelease.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Summer Update"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Release Type</Label>
                <Select
                  value={editedRelease.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select release type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="patch">Patch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editedRelease.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_development">In Development</SelectItem>
                    <SelectItem value="ready_for_qa">Ready for QA</SelectItem>
                    <SelectItem value="in_qa">In QA</SelectItem>
                    <SelectItem value="ready_for_release">Ready for Release</SelectItem>
                    <SelectItem value="released">Released</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plannedReleaseDate">Planned Release Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editedRelease.plannedReleaseDate ? 
                        editedRelease.plannedReleaseDate : 
                        <span className="text-muted-foreground">Pick a date</span>
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editedRelease.plannedReleaseDate ? new Date(editedRelease.plannedReleaseDate) : undefined}
                      onSelect={(date) => handleDateChange('plannedReleaseDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="actualReleaseDate">Actual Release Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={editedRelease.status !== 'released'}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editedRelease.actualReleaseDate ? 
                        editedRelease.actualReleaseDate : 
                        <span className="text-muted-foreground">Set when released</span>
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editedRelease.actualReleaseDate ? new Date(editedRelease.actualReleaseDate) : undefined}
                      onSelect={(date) => handleDateChange('actualReleaseDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="releaseBranch">Release Branch</Label>
                <Input
                  id="releaseBranch"
                  name="releaseBranch"
                  value={editedRelease.releaseBranch || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. release/1.2.0"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={editedRelease.description}
              onChange={handleInputChange}
              placeholder="Describe the release and its key features"
              rows={4}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Release Features</h3>
            <Button onClick={handleAddFeatureClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedRelease.features && editedRelease.features.length > 0 ? (
                editedRelease.features.map(feature => (
                  <TableRow key={feature.id}>
                    <TableCell>
                      {editingFeatureId === feature.id ? (
                        <Input
                          name="name"
                          value={editedFeature?.name || ''}
                          onChange={handleEditedFeatureChange}
                        />
                      ) : (
                        <span className="font-medium">{feature.name}</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {editingFeatureId === feature.id ? (
                        <Input
                          name="description"
                          value={editedFeature?.description || ''}
                          onChange={handleEditedFeatureChange}
                        />
                      ) : (
                        <span className="truncate block">{feature.description}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFeatureId === feature.id ? (
                        <Select
                          value={editedFeature?.status || 'pending'}
                          onValueChange={(value) => handleEditedFeatureSelectChange('status', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="deferred">Deferred</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className="capitalize">
                          {feature.status.replace('_', ' ')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFeatureId === feature.id ? (
                        <Input
                          name="percentComplete"
                          type="number"
                          min="0"
                          max="100"
                          value={editedFeature?.percentComplete || 0}
                          onChange={handleEditedFeatureChange}
                        />
                      ) : (
                        <span>{feature.percentComplete || 0}%</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingFeatureId === feature.id ? (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={saveEditedFeature}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEditingFeature}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => startEditingFeature(feature)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteFeature(feature.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No features added to this release yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Add Feature Dialog */}
          <Dialog open={isAddingFeature} onOpenChange={setIsAddingFeature}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Feature to Release</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="featureName">Feature Name</Label>
                  <Input
                    id="featureName"
                    name="name"
                    value={newFeature.name}
                    onChange={handleNewFeatureInputChange}
                    placeholder="Enter feature name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="featureDescription">Description</Label>
                  <Textarea
                    id="featureDescription"
                    name="description"
                    value={newFeature.description}
                    onChange={handleNewFeatureInputChange}
                    placeholder="Describe the feature"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="featureStatus">Status</Label>
                  <Select
                    value={newFeature.status}
                    onValueChange={(value) => handleNewFeatureSelectChange('status', value)}
                  >
                    <SelectTrigger id="featureStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="deferred">Deferred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="featureProgress">Progress (%)</Label>
                  <Input
                    id="featureProgress"
                    name="percentComplete"
                    type="number"
                    min="0"
                    max="100"
                    value={newFeature.percentComplete || 0}
                    onChange={handleNewFeatureInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingFeature(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewFeatureSubmit}>Add Feature</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="notes" className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Release Notes</h3>
            <Button onClick={handleAddNoteClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User Facing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedRelease.releaseNotes && editedRelease.releaseNotes.length > 0 ? (
                editedRelease.releaseNotes.map(note => (
                  <TableRow key={note.id}>
                    <TableCell>
                      {editingNoteId === note.id ? (
                        <Select
                          value={editedNote?.type || 'feature'}
                          onValueChange={(value) => handleEditedNoteSelectChange('type', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="feature">Feature</SelectItem>
                            <SelectItem value="improvement">Improvement</SelectItem>
                            <SelectItem value="bugfix">Bugfix</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className="capitalize">
                          {note.type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingNoteId === note.id ? (
                        <Input
                          name="title"
                          value={editedNote?.title || ''}
                          onChange={handleEditedNoteChange}
                        />
                      ) : (
                        <span className="font-medium">{note.title}</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {editingNoteId === note.id ? (
                        <Input
                          name="description"
                          value={editedNote?.description || ''}
                          onChange={handleEditedNoteChange}
                        />
                      ) : (
                        <span className="truncate block">{note.description}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingNoteId === note.id ? (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={editedNote?.userFacing || false}
                            onCheckedChange={(checked) => handleEditedNoteSelectChange('userFacing', checked)}
                          />
                          <Label>User facing</Label>
                        </div>
                      ) : (
                        <span>{note.userFacing ? 'Yes' : 'No'}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingNoteId === note.id ? (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={saveEditedNote}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEditingNote}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => startEditingNote(note)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteNote(note.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No release notes added yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Add Note Dialog */}
          <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Release Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="noteType">Type</Label>
                  <Select
                    value={newNote.type}
                    onValueChange={(value) => handleNewNoteSelectChange('type', value as any)}
                  >
                    <SelectTrigger id="noteType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="bugfix">Bugfix</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="noteTitle">Title</Label>
                  <Input
                    id="noteTitle"
                    name="title"
                    value={newNote.title}
                    onChange={handleNewNoteInputChange}
                    placeholder="Enter a title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="noteDescription">Description</Label>
                  <Textarea
                    id="noteDescription"
                    name="description"
                    value={newNote.description}
                    onChange={handleNewNoteInputChange}
                    placeholder="Describe the change"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="userFacing"
                    checked={newNote.userFacing}
                    onCheckedChange={(checked) => handleNewNoteSelectChange('userFacing', checked)}
                  />
                  <Label htmlFor="userFacing">User facing</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                  Cancel
                </Button>
                <Button onClick={handleNewNoteSubmit}>Add Note</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Release</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete release <strong>{editedRelease.version}</strong>?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Release
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReleaseEditor;
