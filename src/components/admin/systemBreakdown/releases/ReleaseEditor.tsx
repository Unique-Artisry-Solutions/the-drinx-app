
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PackageCheck,
  Calendar,
  BadgeCheck,
  FileText,
  UserCheck,
  Download,
  Pencil,
  Trash2,
  PlusCircle,
  ListChecks,
  FileDown,
  Check,
  Clock,
  XCircle,
  AlertTriangle,
  MessageSquarePlus
} from 'lucide-react';

import { Release, ReleaseFeature, ReleaseNote, ReleaseStatus, ReleaseType, ReleaseFeatureStatus } from '../types/releaseTypes';

interface ReleaseEditorProps {
  release: Release;
  onUpdateRelease: (data: Partial<Release>) => void;
  onUpdateStatus: (id: string, status: ReleaseStatus) => void;
  onAddFeature: (feature: Omit<ReleaseFeature, 'id'>) => void;
  onUpdateFeature: (releaseId: string, featureId: string, data: Partial<ReleaseFeature>) => void;
  onRemoveFeature: (featureId: string) => void;
  onAddReleaseNote: (note: ReleaseNote) => void;
  onUpdateReleaseNote: (index: number, note: ReleaseNote) => void;
  onRemoveReleaseNote: (index: number) => void;
  onGenerateNotes: () => void;
  onExportNotes: () => void;
}

const ReleaseEditor: React.FC<ReleaseEditorProps> = ({
  release,
  onUpdateRelease,
  onUpdateStatus,
  onAddFeature,
  onUpdateFeature,
  onRemoveFeature,
  onAddReleaseNote,
  onUpdateReleaseNote,
  onRemoveReleaseNote,
  onGenerateNotes,
  onExportNotes
}) => {
  const [isDetailsEditing, setIsDetailsEditing] = useState(false);
  const [editedRelease, setEditedRelease] = useState<Partial<Release>>({});
  
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [newFeature, setNewFeature] = useState<Omit<ReleaseFeature, 'id'>>({
    name: '',
    description: '',
    status: 'pending'
  });
  
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState<ReleaseNote>({
    type: 'feature',
    title: '',
    description: '',
    userFacing: true
  });
  
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  
  const handleUpdateDetails = () => {
    onUpdateRelease(editedRelease);
    setIsDetailsEditing(false);
    setEditedRelease({});
  };
  
  const handleAddFeature = () => {
    onAddFeature(newFeature);
    setIsAddFeatureOpen(false);
    setNewFeature({
      name: '',
      description: '',
      status: 'pending'
    });
  };
  
  const handleAddNote = () => {
    onAddReleaseNote(newNote);
    setIsAddNoteOpen(false);
    setNewNote({
      type: 'feature',
      title: '',
      description: '',
      userFacing: true
    });
  };
  
  const handleUpdateFeature = (featureId: string, data: Partial<ReleaseFeature>) => {
    onUpdateFeature(release.id, featureId, data);
    setEditingFeatureId(null);
  };
  
  const handleUpdateNote = (index: number, note: ReleaseNote) => {
    onUpdateReleaseNote(index, note);
    setEditingNoteIndex(null);
  };
  
  const renderStatusBadge = (status: ReleaseStatus) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Planned</Badge>;
      case 'in_development':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">In Development</Badge>;
      case 'ready_for_qa':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Ready for QA</Badge>;
      case 'in_qa':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">In QA</Badge>;
      case 'ready_for_release':
        return <Badge variant="outline" className="border-green-500 text-green-500">Ready for Release</Badge>;
      case 'released':
        return <Badge className="bg-green-500">Released</Badge>;
    }
  };
  
  const renderFeatureStatusBadge = (status: ReleaseFeatureStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'deferred':
        return <Badge variant="outline" className="border-red-500 text-red-500">Deferred</Badge>;
    }
  };
  
  const renderReleaseNoteTypeBadge = (type: ReleaseNote['type']) => {
    switch (type) {
      case 'feature':
        return <Badge className="bg-blue-500">Feature</Badge>;
      case 'improvement':
        return <Badge className="bg-green-500">Improvement</Badge>;
      case 'bugfix':
        return <Badge className="bg-amber-500">Bug Fix</Badge>;
      case 'security':
        return <Badge className="bg-red-500">Security</Badge>;
      case 'other':
        return <Badge className="bg-gray-500">Other</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PackageCheck className="h-6 w-6 text-blue-500" />
            <span>{release.name}</span>
            <span className="text-lg font-mono font-medium text-gray-500">v{release.version}</span>
          </h2>
          <div className="flex items-center gap-3 mt-2">
            {renderStatusBadge(release.status)}
            {release.plannedReleaseDate && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Planned: {new Date(release.plannedReleaseDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {release.actualReleaseDate && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <BadgeCheck className="h-4 w-4" />
                <span>
                  Released: {new Date(release.actualReleaseDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* Status update dropdown */}
          <Select 
            value={release.status} 
            onValueChange={(value) => onUpdateStatus(release.id, value as ReleaseStatus)}
            disabled={release.status === 'released'}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update Status" />
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
          
          <Button variant="outline" className="flex items-center gap-2" onClick={onExportNotes}>
            <FileDown className="h-4 w-4" />
            Export Notes
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-1">
            <ListChecks className="h-4 w-4" />
            <span>Features ({release.features.length})</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1">
            <MessageSquarePlus className="h-4 w-4" />
            <span>Release Notes ({release.releaseNotes.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 pt-4">
          {isDetailsEditing ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Edit Release Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-version">Version</Label>
                    <Input 
                      id="edit-version" 
                      defaultValue={release.version}
                      onChange={(e) => setEditedRelease({ ...editedRelease, version: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Type</Label>
                    <Select 
                      defaultValue={release.type} 
                      onValueChange={(value) => setEditedRelease({ ...editedRelease, type: value as ReleaseType })}
                    >
                      <SelectTrigger id="edit-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="major">Major</SelectItem>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="patch">Patch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input 
                    id="edit-name" 
                    defaultValue={release.name}
                    onChange={(e) => setEditedRelease({ ...editedRelease, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor="edit-date">Planned Release Date</Label>
                  <Input 
                    id="edit-date" 
                    type="date" 
                    defaultValue={release.plannedReleaseDate}
                    onChange={(e) => setEditedRelease({ ...editedRelease, plannedReleaseDate: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    defaultValue={release.description}
                    onChange={(e) => setEditedRelease({ ...editedRelease, description: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsDetailsEditing(false)}>Cancel</Button>
                  <Button onClick={handleUpdateDetails}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Release Details</span>
                  <Button variant="ghost" size="sm" onClick={() => setIsDetailsEditing(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Version</dt>
                    <dd className="mt-1 text-lg font-mono">{release.version}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 capitalize">{release.type}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">{renderStatusBadge(release.status)}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Planned Release Date</dt>
                    <dd className="mt-1">
                      {release.plannedReleaseDate ? 
                        new Date(release.plannedReleaseDate).toLocaleDateString() : 
                        <span className="text-gray-400">Not scheduled</span>
                      }
                    </dd>
                  </div>
                  
                  {release.actualReleaseDate && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Actual Release Date</dt>
                      <dd className="mt-1 text-green-600">
                        {new Date(release.actualReleaseDate).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created By</dt>
                    <dd className="mt-1 flex items-center">
                      <UserCheck className="h-4 w-4 mr-1 text-gray-400" />
                      {release.createdBy || "System"}
                    </dd>
                  </div>
                  
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 whitespace-pre-line">
                      {release.description || <span className="text-gray-400">No description provided</span>}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4 pt-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Features</h3>
            <div className="flex gap-2">
              <Dialog open={isAddFeatureOpen} onOpenChange={setIsAddFeatureOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Feature
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Feature</DialogTitle>
                    <DialogDescription>
                      Add a new feature to be included in this release.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="feature-name">Feature Name</Label>
                      <Input 
                        id="feature-name"
                        value={newFeature.name}
                        onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
                        placeholder="Enter feature name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="feature-description">Description</Label>
                      <Textarea 
                        id="feature-description"
                        value={newFeature.description}
                        onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                        placeholder="Describe the feature"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="feature-status">Status</Label>
                      <Select 
                        value={newFeature.status} 
                        onValueChange={(value) => setNewFeature({...newFeature, status: value as ReleaseFeatureStatus})}
                      >
                        <SelectTrigger id="feature-status">
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
                      <Label htmlFor="feature-assigned">Assigned To (Optional)</Label>
                      <Input 
                        id="feature-assigned"
                        value={newFeature.assignedTo || ''}
                        onChange={(e) => setNewFeature({...newFeature, assignedTo: e.target.value})}
                        placeholder="Enter assignee name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="feature-notes">Notes (Optional)</Label>
                      <Textarea 
                        id="feature-notes"
                        value={newFeature.notes || ''}
                        onChange={(e) => setNewFeature({...newFeature, notes: e.target.value})}
                        placeholder="Any additional notes"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddFeatureOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddFeature}
                      disabled={!newFeature.name || !newFeature.description}
                    >
                      Add Feature
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {release.features.length === 0 ? (
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <ListChecks className="h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No Features Yet</h3>
                  <p className="text-gray-500 mt-1 max-w-md">
                    Add features that will be included in this release to track their implementation status.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {release.features.map((feature) => (
                <Card key={feature.id} className="overflow-hidden">
                  {editingFeatureId === feature.id ? (
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`edit-feature-name-${feature.id}`}>Feature Name</Label>
                          <Input 
                            id={`edit-feature-name-${feature.id}`}
                            defaultValue={feature.name}
                            onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-feature-description-${feature.id}`}>Description</Label>
                          <Textarea 
                            id={`edit-feature-description-${feature.id}`}
                            defaultValue={feature.description}
                            onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                            rows={3}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-feature-status-${feature.id}`}>Status</Label>
                            <Select 
                              defaultValue={feature.status} 
                              onValueChange={(value) => setNewFeature({...newFeature, status: value as ReleaseFeatureStatus})}
                            >
                              <SelectTrigger id={`edit-feature-status-${feature.id}`}>
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
                            <Label htmlFor={`edit-feature-assigned-${feature.id}`}>Assigned To</Label>
                            <Input 
                              id={`edit-feature-assigned-${feature.id}`}
                              defaultValue={feature.assignedTo || ''}
                              onChange={(e) => setNewFeature({...newFeature, assignedTo: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-feature-notes-${feature.id}`}>Notes</Label>
                          <Textarea 
                            id={`edit-feature-notes-${feature.id}`}
                            defaultValue={feature.notes || ''}
                            onChange={(e) => setNewFeature({...newFeature, notes: e.target.value})}
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-2">
                          <Button variant="outline" onClick={() => setEditingFeatureId(null)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => handleUpdateFeature(feature.id, newFeature)}
                            disabled={!newFeature.name || !newFeature.description}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    <>
                      <div className={`h-2 ${
                        feature.status === 'completed' ? 'bg-green-500' : 
                        feature.status === 'in_progress' ? 'bg-blue-500' :
                        feature.status === 'deferred' ? 'bg-red-500' : 'bg-gray-300'
                      }`} />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-medium flex items-center">
                              {feature.name}
                              <span className="ml-2">{renderFeatureStatusBadge(feature.status)}</span>
                            </h4>
                            <p className="text-gray-600 mt-1">{feature.description}</p>
                            
                            {(feature.assignedTo || feature.notes) && (
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                {feature.assignedTo && (
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 block">Assigned To</label>
                                    <span className="flex items-center mt-1">
                                      <UserCheck className="h-4 w-4 mr-1 text-gray-400" />
                                      {feature.assignedTo}
                                    </span>
                                  </div>
                                )}
                                
                                {feature.notes && (
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 block">Notes</label>
                                    <p className="text-sm mt-1">{feature.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setNewFeature({
                                  name: feature.name,
                                  description: feature.description,
                                  status: feature.status,
                                  assignedTo: feature.assignedTo,
                                  notes: feature.notes
                                });
                                setEditingFeatureId(feature.id);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                              onClick={() => onRemoveFeature(feature.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {feature.status === 'in_progress' && (
                          <div className="flex items-center mt-3 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            <Clock className="h-4 w-4 mr-1" />
                            In progress
                          </div>
                        )}
                        {feature.status === 'completed' && (
                          <div className="flex items-center mt-3 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                            <Check className="h-4 w-4 mr-1" />
                            Completed
                          </div>
                        )}
                        {feature.status === 'deferred' && (
                          <div className="flex items-center mt-3 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                            <XCircle className="h-4 w-4 mr-1" />
                            Deferred to future release
                          </div>
                        )}
                      </CardContent>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4 pt-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Release Notes</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={onGenerateNotes}
                disabled={release.features.filter(f => f.status === 'completed').length === 0}
              >
                <Download className="h-4 w-4" />
                Generate from Features
              </Button>
              
              <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Release Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Release Note</DialogTitle>
                    <DialogDescription>
                      Add a new item to the release notes.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="note-type">Type</Label>
                      <Select 
                        value={newNote.type} 
                        onValueChange={(value) => setNewNote({...newNote, type: value as ReleaseNote['type']})}
                      >
                        <SelectTrigger id="note-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="improvement">Improvement</SelectItem>
                          <SelectItem value="bugfix">Bug Fix</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="note-title">Title</Label>
                      <Input 
                        id="note-title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                        placeholder="Enter a concise title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="note-description">Description</Label>
                      <Textarea 
                        id="note-description"
                        value={newNote.description}
                        onChange={(e) => setNewNote({...newNote, description: e.target.value})}
                        placeholder="Enter a user-friendly description"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="note-technical">Technical Details (Optional)</Label>
                      <Textarea 
                        id="note-technical"
                        value={newNote.technicalDetails || ''}
                        onChange={(e) => setNewNote({...newNote, technicalDetails: e.target.value})}
                        placeholder="Add technical implementation details"
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        id="user-facing"
                        type="checkbox"
                        checked={newNote.userFacing}
                        onChange={(e) => setNewNote({...newNote, userFacing: e.target.checked})}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="user-facing">Show in user-facing release notes</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddNoteOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddNote}
                      disabled={!newNote.title || !newNote.description}
                    >
                      Add Note
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {release.releaseNotes.length === 0 ? (
            <Card>
              <CardContent className="py-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No Release Notes Yet</h3>
                  <p className="text-gray-500 mt-1 max-w-md">
                    Add release notes to document changes and new features for users and stakeholders.
                  </p>
                  {release.features.filter(f => f.status === 'completed').length > 0 && (
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={onGenerateNotes}
                    >
                      Generate from Completed Features
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {release.releaseNotes.map((note, index) => (
                <Card key={index}>
                  {editingNoteIndex === index ? (
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`edit-note-type-${index}`}>Type</Label>
                          <Select 
                            defaultValue={note.type} 
                            onValueChange={(value) => setNewNote({...newNote, type: value as ReleaseNote['type']})}
                          >
                            <SelectTrigger id={`edit-note-type-${index}`}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="feature">Feature</SelectItem>
                              <SelectItem value="improvement">Improvement</SelectItem>
                              <SelectItem value="bugfix">Bug Fix</SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-note-title-${index}`}>Title</Label>
                          <Input 
                            id={`edit-note-title-${index}`}
                            defaultValue={note.title}
                            onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-note-description-${index}`}>Description</Label>
                          <Textarea 
                            id={`edit-note-description-${index}`}
                            defaultValue={note.description}
                            onChange={(e) => setNewNote({...newNote, description: e.target.value})}
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`edit-note-technical-${index}`}>Technical Details</Label>
                          <Textarea 
                            id={`edit-note-technical-${index}`}
                            defaultValue={note.technicalDetails || ''}
                            onChange={(e) => setNewNote({...newNote, technicalDetails: e.target.value})}
                            rows={2}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            id={`edit-user-facing-${index}`}
                            type="checkbox"
                            defaultChecked={note.userFacing}
                            onChange={(e) => setNewNote({...newNote, userFacing: e.target.checked})}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`edit-user-facing-${index}`}>Show in user-facing release notes</Label>
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-2">
                          <Button variant="outline" onClick={() => setEditingNoteIndex(null)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => handleUpdateNote(index, newNote)}
                            disabled={!newNote.title || !newNote.description}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            {renderReleaseNoteTypeBadge(note.type)}
                            {!note.userFacing && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                Internal Only
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-medium">{note.title}</h4>
                          <p className="text-gray-600 mt-1">{note.description}</p>
                          
                          {note.technicalDetails && (
                            <div className="mt-3">
                              <details className="group">
                                <summary className="flex items-center cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                  <span>Technical Details</span>
                                </summary>
                                <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                                  {note.technicalDetails}
                                </div>
                              </details>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setNewNote({
                                type: note.type,
                                title: note.title,
                                description: note.description,
                                technicalDetails: note.technicalDetails,
                                userFacing: note.userFacing
                              });
                              setEditingNoteIndex(index);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            onClick={() => onRemoveReleaseNote(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReleaseEditor;
