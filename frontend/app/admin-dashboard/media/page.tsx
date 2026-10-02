"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Image,
  Upload,
  Search,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Filter,
  Download,
  Loader2,
  X,
  Check,
  AlertCircle,
  FileImage,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import {
  useGetMediaQuery,
  useUploadMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
} from "@/services/mediaApi";

const MediaPage = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: mediaResponse, isLoading, isError, error } = useGetMediaQuery();
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();
  const [updateMedia, { isLoading: isUpdating }] = useUpdateMediaMutation();
  const [deleteMedia, { isLoading: isDeleting }] = useDeleteMediaMutation();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [contextFilter, setContextFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Preview dialog
  const [previewImage, setPreviewImage] = useState<any>(null);

  // Rename dialog
  const [renameImage, setRenameImage] = useState<any>(null);
  const [renameValue, setRenameValue] = useState("");

  // Edit details dialog
  const [editImage, setEditImage] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    altText: "",
    context: "",
    pageUrl: "",
    order: 0,
    active: true,
  });

  // Delete confirmation dialog
  const [deleteImage, setDeleteImage] = useState<any>(null);

  const mediaFiles = Array.isArray(mediaResponse?.data)
    ? mediaResponse.data
    : [];

  // Get unique contexts for filter
  const contexts = React.useMemo(() => {
    const ctxSet = new Set<string>();
    mediaFiles.forEach((f: any) => {
      if (f.context) ctxSet.add(f.context);
    });
    return Array.from(ctxSet).sort();
  }, [mediaFiles]);

  // Filter media
  const filteredMedia = mediaFiles.filter((file: any) => {
    const matchesSearch = (file.altText || file.filename || file.publicId || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesContext =
      contextFilter === "all" || file.context === contextFilter;
    return matchesSearch && matchesContext;
  });

  // --- Handlers ---

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await uploadMedia(formData).unwrap();
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded.`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description:
          err?.data?.message || err.message || "Something went wrong",
      });
    }

    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  const openPreview = (file: any) => {
    setPreviewImage(file);
  };

  const openRenameDialog = (file: any) => {
    setRenameImage(file);
    setRenameValue(file.altText || file.filename || "");
  };

  const handleRename = async () => {
    if (!renameImage) return;
    try {
      await updateMedia({
        id: renameImage._id || renameImage.id,
        body: { altText: renameValue },
      }).unwrap();
      toast({ title: "Renamed", description: "Image alt text updated." });
      setRenameImage(null);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Rename failed",
        description:
          err?.data?.message || err.message || "Something went wrong",
      });
    }
  };

  const openEditDialog = (file: any) => {
    setEditImage(file);
    setEditForm({
      altText: file.altText || "",
      context: file.context || "",
      pageUrl: file.pageUrl || "",
      order: file.order ?? 0,
      active: file.active !== false,
    });
  };

  const handleEditSave = async () => {
    if (!editImage) return;
    try {
      await updateMedia({
        id: editImage._id || editImage.id,
        body: editForm,
      }).unwrap();
      toast({ title: "Updated", description: "Image details updated." });
      setEditImage(null);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description:
          err?.data?.message || err.message || "Something went wrong",
      });
    }
  };

  const openDeleteDialog = (file: any) => {
    setDeleteImage(file);
  };

  const handleDelete = async () => {
    if (!deleteImage) return;
    try {
      await deleteMedia(deleteImage._id || deleteImage.id).unwrap();
      toast({ title: "Deleted", description: "Image has been deleted." });
      setDeleteImage(null);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description:
          err?.data?.message || err.message || "Something went wrong",
      });
    }
  };

  // --- Loading / Error states ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading media library...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load media
          </h2>
          <p className="text-gray-500 mb-6">
            {(error as any)?.data?.message ||
              "There was an error fetching media files."}
          </p>
          <Button variant="default" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Media Library
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and organize all uploaded images ({mediaFiles.length} total)
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button
            variant="default"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, alt text, or filename..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={contextFilter} onValueChange={setContextFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Contexts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contexts</SelectItem>
                  {contexts.map((ctx) => (
                    <SelectItem key={ctx} value={ctx}>
                      {ctx}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={viewMode === "grid" ? "default" : "secondary"}
                size="icon"
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <FileImage className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "secondary"}
                size="icon"
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <Filter className="h-4 w-4 rotate-90" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid / List */}
      {filteredMedia.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium text-lg mb-2">No media files found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || contextFilter !== "all"
                ? "Try a different search term or filter"
                : "Upload your first file to get started"}
            </p>
            <Button onClick={handleUploadClick}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((file: any) => (
            <Card key={file._id || file.id} className="overflow-hidden group">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={file.url}
                  alt={file.altText || file.filename || "Image"}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openPreview(file)}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => openPreview(file)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() =>
                      handleDownload(file.url, file.filename || "image")
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => openDeleteDialog(file)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                {!file.active && (
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 border-yellow-300"
                    >
                      Inactive
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p
                      className="font-medium text-sm truncate"
                      title={file.altText || file.filename || "Untitled"}
                    >
                      {file.altText || file.filename || "Untitled"}
                    </p>
                    {file.context && (
                      <p className="text-xs text-gray-500">{file.context}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {file.createdAt ? formatDate(file.createdAt) : ""}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => openPreview(file)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleDownload(file.url, file.filename || "image")
                        }
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openRenameDialog(file)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(file)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => openDeleteDialog(file)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge variant="secondary" className="mt-2">
                  {file.url?.split(".").pop()?.toUpperCase() || "IMAGE"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <Card>
          <div className="divide-y">
            {filteredMedia.map((file: any) => (
              <div
                key={file._id || file.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={file.url}
                    alt={file.altText || file.filename || "Image"}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openPreview(file)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {file.altText || file.filename || "Untitled"}
                  </p>
                  <div className="flex gap-3 text-xs text-gray-500 mt-1">
                    {file.context && <span>{file.context}</span>}
                    <span>
                      {file.width && file.height
                        ? `${file.width} × ${file.height}`
                        : ""}
                    </span>
                    <span>
                      {file.createdAt ? formatDate(file.createdAt) : ""}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="flex-shrink-0">
                  {file.url?.split(".").pop()?.toUpperCase() || "IMAGE"}
                </Badge>
                {!file.active && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 flex-shrink-0"
                  >
                    Inactive
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => openPreview(file)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleDownload(file.url, file.filename || "image")
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openRenameDialog(file)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEditDialog(file)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => openDeleteDialog(file)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {previewImage?.altText ||
                previewImage?.filename ||
                "Image Preview"}
            </DialogTitle>
            <DialogDescription>
              {previewImage?.context && (
                <span className="block">Context: {previewImage.context}</span>
              )}
              {previewImage?.width && previewImage?.height && (
                <span className="block">
                  Dimensions: {previewImage.width} × {previewImage.height}px
                </span>
              )}
              {previewImage?.pageUrl && (
                <span className="block">Page URL: {previewImage.pageUrl}</span>
              )}
              {previewImage?.createdAt && (
                <span className="block">
                  Uploaded: {formatDate(previewImage.createdAt)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden max-h-[60vh]">
            {previewImage && (
              <img
                src={previewImage.url}
                alt={previewImage.altText || "Preview"}
                className="max-w-full max-h-[60vh] object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() =>
                handleDownload(
                  previewImage?.url,
                  previewImage?.filename || "image",
                )
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="default" onClick={() => setPreviewImage(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={!!renameImage} onOpenChange={() => setRenameImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Image</DialogTitle>
            <DialogDescription>
              Update the alt text / name for this image.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename">Alt Text / Name</Label>
              <Input
                id="rename"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="Enter new name..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameImage(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={isUpdating || !renameValue.trim()}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Details Dialog */}
      <Dialog open={!!editImage} onOpenChange={() => setEditImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image Details</DialogTitle>
            <DialogDescription>
              Update metadata for this image.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-altText">Alt Text</Label>
              <Input
                id="edit-altText"
                value={editForm.altText}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, altText: e.target.value }))
                }
                placeholder="Descriptive alt text..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-context">Context</Label>
              <Input
                id="edit-context"
                value={editForm.context}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, context: e.target.value }))
                }
                placeholder="e.g., about-page-banner, hero-image..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-pageUrl">Page URL</Label>
              <Input
                id="edit-pageUrl"
                value={editForm.pageUrl}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, pageUrl: e.target.value }))
                }
                placeholder="/about-us"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-order">Order</Label>
              <Input
                id="edit-order"
                type="number"
                value={editForm.order}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-active"
                checked={editForm.active}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, active: e.target.checked }))
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditImage(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteImage} onOpenChange={() => setDeleteImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone. The image will be permanently removed from both the
              database and cloud storage.
            </DialogDescription>
          </DialogHeader>
          {deleteImage && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={deleteImage.url}
                  alt={deleteImage.altText || "Image"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-sm">
                  {deleteImage.altText || deleteImage.filename || "Untitled"}
                </p>
                <p className="text-xs text-gray-500">
                  {deleteImage.context || "No context"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteImage(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaPage;
