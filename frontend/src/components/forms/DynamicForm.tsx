import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Store } from "lucide-react";
import { useForm } from "react-hook-form";
import { api, resolveMediaUrl } from "../../api/client";
import { CATEGORY_ICON_OPTIONS, categoryIconMap } from "../../utils/icons";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

type ImageListItem = {
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

type MediaLibraryFolder = {
  name: string;
  path: string;
  fileCount: number;
};

type MediaLibraryFile = {
  name: string;
  folder: string;
  filePath: string;
  fileUrl: string;
  size: number;
  modifiedAt: string;
};

type MediaLibraryData = {
  currentFolder: string;
  folders: MediaLibraryFolder[];
  files: MediaLibraryFile[];
};

type CategoryAssignmentItem = {
  categoryId: number;
  subcategoryId?: number | null;
  isPrimary: boolean;
};

const DEFAULT_MEDIA_FOLDER = "General";
const ACCEPTED_IMAGE_INPUT_TYPES =
  ".avif,.bmp,.dib,.gif,.heic,.heif,.ico,.jfif,.jif,.jpe,.jpeg,.jpg,.pjp,.pjpeg,.png,.svg,.tif,.tiff,.webp,image/*";

export type FieldConfig = {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "textarea"
    | "checkbox"
    | "select"
    | "json"
    | "datetime-local"
    | "image"
    | "image-list"
    | "icon"
    | "multi-select"
    | "category-assignments";
  options?: { label: string; value: string }[];
  placeholder?: string;
  mediaFolder?: string;
  valueType?: "string" | "number";
  subOptions?: { label: string; value: string; parentValue?: string }[];
};

const uploadImage = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("folder", folder);
  formData.append("file", file);
  const response = await api.postForm<{ data: { fileUrl: string } }>("/media/upload", formData);
  return response.data.fileUrl;
};

const fetchMediaLibrary = async (folder: string) => {
  const response = await api.get<{ data: MediaLibraryData }>(
    `/media/library?folder=${encodeURIComponent(folder)}`
  );
  return response.data;
};

const createEmptyLibrary = (folder: string): MediaLibraryData => ({
  currentFolder: folder,
  folders: [{ name: folder, path: folder, fileCount: 0 }],
  files: []
});

const useMediaLibrary = (folder: string) => {
  const [library, setLibrary] = useState<MediaLibraryData>(() => createEmptyLibrary(folder));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLibrary = async (targetFolder = folder) => {
    setIsLoading(true);
    setError(null);

    try {
      const nextLibrary = await fetchMediaLibrary(targetFolder);
      setLibrary(nextLibrary);
    } catch (libraryError) {
      const message = libraryError instanceof Error ? libraryError.message : "Failed to load media library";
      setError(message);
      setLibrary(createEmptyLibrary(targetFolder));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLibrary(folder);
  }, [folder]);

  return { library, isLoading, error, reload: loadLibrary };
};

const parseImageList = (value: unknown): ImageListItem[] => {
  if (Array.isArray(value)) {
    const items: ImageListItem[] = [];

    value.forEach((entry, index) => {
      if (!entry || typeof entry !== "object") {
        return;
      }

      const item = entry as Partial<ImageListItem>;
      if (typeof item.imageUrl !== "string" || !item.imageUrl.trim()) {
        return;
      }

      items.push({
        imageUrl: item.imageUrl,
        altText: item.altText ?? null,
        sortOrder: typeof item.sortOrder === "number" ? item.sortOrder : index,
        isPrimary: Boolean(item.isPrimary)
      });
    });

    return items;
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    return parseImageList(JSON.parse(value));
  } catch {
    return [];
  }
};

const stringifyImageList = (items: ImageListItem[]) => JSON.stringify(items, null, 2);

const inferMediaFolder = (value: unknown, fallback?: string) => {
  if (typeof value !== "string" || !value.trim()) {
    return fallback ?? DEFAULT_MEDIA_FOLDER;
  }

  const normalizedValue = value
    .trim()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/\?.*$/, "")
    .replace(/^\/+/, "")
    .replace(/^uploads\/?/i, "");
  const segments = normalizedValue.split("/").filter(Boolean);

  if (segments.length > 1) {
    return segments.slice(0, -1).join("/");
  }

  return fallback ?? DEFAULT_MEDIA_FOLDER;
};

const getMediaLabel = (value: string) => {
  const normalizedValue = value.trim().replace(/^https?:\/\/[^/]+/i, "").replace(/\?.*$/, "");
  const segments = normalizedValue.split("/").filter(Boolean);
  return segments[segments.length - 1] || value;
};

const buildObjectPreview = (file: File) => URL.createObjectURL(file);

const parseValueByType = (value: string, valueType?: "string" | "number") =>
  valueType === "number" ? Number(value) : value;

const parseCategoryAssignments = (value: unknown): CategoryAssignmentItem[] => {
  if (Array.isArray(value)) {
    return value
      .filter((entry) => entry && typeof entry === "object")
      .map((entry) => entry as Partial<CategoryAssignmentItem>)
      .filter((entry) => Number.isFinite(entry.categoryId))
      .map((entry, index) => ({
        categoryId: Number(entry.categoryId),
        subcategoryId: entry.subcategoryId ? Number(entry.subcategoryId) : null,
        isPrimary: Boolean(entry.isPrimary) || index === 0
      }));
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    return parseCategoryAssignments(JSON.parse(value));
  } catch {
    return [];
  }
};

const stringifyCategoryAssignments = (items: CategoryAssignmentItem[]) =>
  JSON.stringify(
    items.map((item, index) => ({
      categoryId: Number(item.categoryId),
      subcategoryId: item.subcategoryId ? Number(item.subcategoryId) : null,
      isPrimary: item.isPrimary || index === 0
    })),
    null,
    2
  );

const IconPickerField = ({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: unknown;
  onChange: (value: string | null) => void;
  options?: { label: string; value: string }[];
}) => {
  const [search, setSearch] = useState("");
  const currentValue = typeof value === "string" ? value : "";
  const CurrentIcon = currentValue ? categoryIconMap[currentValue] : null;
  const iconOptions = options?.length ? options : CATEGORY_ICON_OPTIONS;
  const filteredOptions = iconOptions.filter((option) =>
    option.label.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="field">
      <span>{label}</span>

      <div className="icon-picker">
        <div className="icon-picker-toolbar">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search icons"
          />
          <Button type="button" variant="ghost" onClick={() => onChange(null)}>
            Clear
          </Button>
        </div>

        <div className="icon-picker-current">
          <span className="field-hint">Selected icon</span>
          <div className="icon-picker-current-value">
            <span className="icon-preview-badge">
              {CurrentIcon ? <CurrentIcon size={18} /> : <Store size={18} />}
            </span>
            <strong>{currentValue || "No icon selected"}</strong>
          </div>
        </div>

        <div className="icon-grid">
          {filteredOptions.map((option) => {
            const Icon = categoryIconMap[option.value];
            const isSelected = currentValue === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={`icon-tile${isSelected ? " selected" : ""}`}
                onClick={() => onChange(option.value)}
              >
                <span className="icon-preview-badge">{Icon ? <Icon size={18} /> : <Store size={18} />}</span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MultiSelectField = ({
  label,
  value,
  onChange,
  options,
  valueType
}: {
  label: string;
  value: unknown;
  onChange: (value: string) => void;
  options?: { label: string; value: string }[];
  valueType?: "string" | "number";
}) => {
  const selectedValues: string[] = Array.isArray(value)
    ? value.map((entry) => String(entry))
    : typeof value === "string" && value.trim()
      ? (() => {
          try {
            return (JSON.parse(value) as unknown[]).map((entry) => String(entry));
          } catch {
            return [];
          }
        })()
      : [];

  return (
    <div className="field">
      <span>{label}</span>
      <div className="selector-panel">
        <div className="selector-grid">
          {(options ?? []).map((option) => {
            const checked = selectedValues.includes(option.value);

            return (
              <label key={option.value} className={`selector-tile${checked ? " selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    const nextValues = event.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((currentValue) => currentValue !== option.value);
                    const parsedValues = nextValues.map((currentValue) => parseValueByType(currentValue, valueType));
                    onChange(JSON.stringify(parsedValues, null, 2));
                  }}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CategoryAssignmentsField = ({
  label,
  value,
  onChange,
  options,
  subOptions
}: {
  label: string;
  value: unknown;
  onChange: (value: string) => void;
  options?: { label: string; value: string }[];
  subOptions?: { label: string; value: string; parentValue?: string }[];
}) => {
  const items = parseCategoryAssignments(value);

  const syncItems = (nextItems: CategoryAssignmentItem[]) => {
    const normalizedItems = nextItems.map((item, index) => ({
      ...item,
      isPrimary: nextItems.some((entry) => entry.isPrimary) ? item.isPrimary : index === 0
    }));
    onChange(stringifyCategoryAssignments(normalizedItems));
  };

  return (
    <div className="field">
      <span>{label}</span>
      <div className="selector-panel stack-sm">
        {items.map((item, index) => {
          const availableSubcategories = (subOptions ?? []).filter(
            (option) => option.parentValue === String(item.categoryId)
          );

          return (
            <div key={`${item.categoryId}-${index}`} className="assignment-row">
              <label className="field">
                <span>Category</span>
                <select
                  value={String(item.categoryId)}
                  onChange={(event) =>
                    syncItems(
                      items.map((entry, itemIndex) =>
                        itemIndex === index
                          ? {
                              categoryId: Number(event.target.value),
                              subcategoryId: null,
                              isPrimary: entry.isPrimary
                            }
                          : entry
                      )
                    )
                  }
                >
                  <option value="">Select category</option>
                  {(options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Subcategory</span>
                <select
                  value={item.subcategoryId ? String(item.subcategoryId) : ""}
                  onChange={(event) =>
                    syncItems(
                      items.map((entry, itemIndex) =>
                        itemIndex === index
                          ? {
                              ...entry,
                              subcategoryId: event.target.value ? Number(event.target.value) : null
                            }
                          : entry
                      )
                    )
                  }
                >
                  <option value="">No subcategory</option>
                  {availableSubcategories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="selector-inline">
                <input
                  type="checkbox"
                  checked={item.isPrimary}
                  onChange={() =>
                    syncItems(
                      items.map((entry, itemIndex) => ({
                        ...entry,
                        isPrimary: itemIndex === index
                      }))
                    )
                  }
                />
                <span>Primary</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                onClick={() => syncItems(items.filter((_, itemIndex) => itemIndex !== index))}
              >
                Remove
              </Button>
            </div>
          );
        })}
        <Button
          type="button"
          variant="secondary"
          disabled={!options?.length}
          onClick={() =>
            syncItems([
              ...items,
              {
                categoryId: Number(options?.[0]?.value ?? 0),
                subcategoryId: null,
                isPrimary: items.length === 0
              }
            ])
          }
        >
          Add Category
        </Button>
      </div>
    </div>
  );
};

const MediaLibrarySection = ({
  title,
  targetFolder,
  files,
  isLoading,
  isUploading,
  onUpload,
  selectedUrls,
  onPickFile,
  allowMultiple,
  emptyMessage,
  pickLabel
}: {
  title: string;
  targetFolder: string;
  files: MediaLibraryFile[];
  isLoading: boolean;
  isUploading: boolean;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  selectedUrls: string[];
  onPickFile: (file: MediaLibraryFile) => void;
  allowMultiple: boolean;
  emptyMessage: string;
  pickLabel: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="media-library">
        <label className="field">
          <span>{isUploading ? "Uploading..." : "Upload image"}</span>
          <input
            type="file"
            accept={ACCEPTED_IMAGE_INPUT_TYPES}
            multiple={allowMultiple}
            onChange={(event) => void onUpload(event)}
          />
        </label>

        <div className="image-field-actions">
          <span className="field-hint">
            {isLoading
              ? `Loading images saved for ${targetFolder}...`
              : `Uploads are saved automatically to ${targetFolder}. ${files.length} image${files.length === 1 ? "" : "s"} available.`}
          </span>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(true)}>
            {files.length ? `Choose From ${files.length} Saved Image${files.length === 1 ? "" : "s"}` : "Browse Existing Images"}
          </Button>
        </div>
      </div>

      <Modal open={isOpen} title={title} onClose={() => setIsOpen(false)}>
        <div className="media-library-modal">
          <p className="field-hint">
            {isLoading
              ? `Loading images saved for ${targetFolder}...`
              : `Uploads are saved automatically to ${targetFolder}. ${files.length} image${files.length === 1 ? "" : "s"} available.`}
          </p>

          {files.length ? (
            <div className="media-grid">
              {files.map((file) => {
                const previewUrl = resolveMediaUrl(file.fileUrl);
                const isSelected = selectedUrls.includes(file.fileUrl);

                return (
                  <button
                    key={file.fileUrl}
                    type="button"
                    className={`media-tile${isSelected ? " selected" : ""}`}
                    onClick={() => {
                      onPickFile(file);
                      if (!allowMultiple) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    {previewUrl ? <img src={previewUrl} alt={file.name} /> : null}
                    <div className="media-tile-body">
                      <strong>{file.name}</strong>
                      <span className="field-hint">{isSelected ? "Selected" : pickLabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="media-empty-state">{emptyMessage}</div>
          )}
        </div>
      </Modal>
    </>
  );
};

const SingleImageField = ({
  label,
  value,
  onChange,
  mediaFolder,
  registerPendingUpload
}: {
  label: string;
  value: unknown;
  onChange: (value: string | null) => void;
  mediaFolder?: string;
  registerPendingUpload: (handler: () => Promise<string | undefined>) => void;
}) => {
  const currentValue = typeof value === "string" ? value : "";
  const targetFolder = mediaFolder ?? inferMediaFolder(currentValue, mediaFolder);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const { library, isLoading, error: libraryError, reload } = useMediaLibrary(targetFolder);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = buildObjectPreview(selectedFile);
    setSelectedPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [selectedFile]);

  useEffect(() => {
    registerPendingUpload(async () => undefined);
  }, [registerPendingUpload]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setActionError(null);
    setSelectedFile(file);
    setIsUploading(true);

    try {
      const fileUrl = await uploadImage(file, targetFolder);
      onChange(fileUrl);
      setSelectedFile(null);
      await reload(targetFolder);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : "Image upload failed";
      setActionError(message);
    } finally {
      setIsUploading(false);
    }

    event.target.value = "";
  };

  const previewUrl = selectedPreviewUrl ?? resolveMediaUrl(currentValue);

  return (
    <div className="field">
      <span>{label}</span>

      {previewUrl ? (
        <div className="image-preview">
          {previewUrl ? <img src={previewUrl} alt={currentValue || label} /> : null}
          <div className="media-selection-bar">
            <span className="field-hint">
              {selectedFile ? `Uploading: ${selectedFile.name}` : getMediaLabel(currentValue || label)}
            </span>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSelectedFile(null);
                onChange(null);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}

      {actionError || libraryError ? <div className="error-banner">{actionError || libraryError}</div> : null}

      <MediaLibrarySection
        title={`${label} Library`}
        targetFolder={targetFolder}
        files={library.files}
        isLoading={isLoading}
        isUploading={isUploading}
        onUpload={handleUpload}
        selectedUrls={currentValue ? [currentValue] : []}
        onPickFile={(file) => onChange(file.fileUrl)}
        allowMultiple={false}
        emptyMessage="No images found here yet. Upload one from your device."
        pickLabel="Use image"
      />
      <span className="field-hint">
        {selectedFile
          ? "Image upload is in progress."
          : "Choose an image to upload it immediately, then save the form."}
      </span>
    </div>
  );
};

const ImageListField = ({
  label,
  value,
  onChange,
  mediaFolder,
  registerPendingUpload
}: {
  label: string;
  value: unknown;
  onChange: (value: string) => void;
  mediaFolder?: string;
  registerPendingUpload: (handler: () => Promise<string | undefined>) => void;
}) => {
  const items = parseImageList(value);
  const targetFolder = mediaFolder ?? inferMediaFolder(items[0]?.imageUrl, mediaFolder);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviewUrls, setPendingPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const { library, isLoading, error: libraryError, reload } = useMediaLibrary(targetFolder);

  useEffect(() => {
    const nextPreviewUrls = pendingFiles.map((file) => buildObjectPreview(file));
    setPendingPreviewUrls(nextPreviewUrls);

    return () => {
      nextPreviewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, [pendingFiles]);

  useEffect(() => {
    registerPendingUpload(async () => {
      if (!pendingFiles.length) {
        return undefined;
      }

      setIsUploading(true);
      setActionError(null);

      try {
        const uploadedFiles = await Promise.all(pendingFiles.map((file) => uploadImage(file, targetFolder)));
        const existingUrls = new Set(items.map((item) => item.imageUrl));
        const nextItems = [
          ...items,
          ...uploadedFiles
            .filter((fileUrl) => !existingUrls.has(fileUrl))
            .map((imageUrl, index) => ({
              imageUrl,
              altText: null,
              sortOrder: items.length + index,
              isPrimary: items.length === 0 && index === 0
            }))
        ];
        const nextValue = stringifyImageList(
          nextItems.map((item, index) => ({
            ...item,
            sortOrder: index,
            isPrimary: nextItems.some((entry) => entry.isPrimary) ? item.isPrimary : index === 0
          }))
        );

        setPendingFiles([]);
        onChange(nextValue);
        await reload(targetFolder);
        return nextValue;
      } catch (uploadError) {
        const message = uploadError instanceof Error ? uploadError.message : "Image upload failed";
        setActionError(message);
        throw uploadError;
      } finally {
        setIsUploading(false);
      }
    });
  }, [items, onChange, pendingFiles, registerPendingUpload, reload, targetFolder]);

  const syncItems = (nextItems: ImageListItem[]) => {
    const normalized = nextItems.map((item, index) => ({
      ...item,
      sortOrder: index,
      isPrimary: nextItems.some((entry) => entry.isPrimary) ? item.isPrimary : index === 0
    }));

    onChange(stringifyImageList(normalized));
  };

  const addImage = (imageUrl: string) => {
    if (items.some((item) => item.imageUrl === imageUrl)) {
      return;
    }

    syncItems([
      ...items,
      {
        imageUrl,
        altText: null,
        sortOrder: items.length,
        isPrimary: items.length === 0
      }
    ]);
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    setActionError(null);
    setPendingFiles((currentFiles) => [...currentFiles, ...files]);
    event.target.value = "";
  };

  return (
    <div className="field">
      <span>{label}</span>

      {actionError || libraryError ? <div className="error-banner">{actionError || libraryError}</div> : null}

      {items.length || pendingFiles.length ? (
        <div className="image-list-preview">
          {items.map((item, index) => {
            const previewUrl = resolveMediaUrl(item.imageUrl);

            return (
              <div key={`${item.imageUrl}-${index}`} className="image-list-item">
                {previewUrl ? <img src={previewUrl} alt={item.altText || `Product image ${index + 1}`} /> : null}
                <div className="stack-sm">
                  <strong>{item.isPrimary ? "Primary image" : `Image ${index + 1}`}</strong>
                  <span className="field-hint">{getMediaLabel(item.imageUrl)}</span>
                  <label className="field">
                    <span>Alt text</span>
                    <input
                      value={item.altText ?? ""}
                      onChange={(event) =>
                        syncItems(
                          items.map((entry, itemIndex) =>
                            itemIndex === index ? { ...entry, altText: event.target.value || null } : entry
                          )
                        )
                      }
                    />
                  </label>
                  <div className="row-actions">
                    <Button
                      type="button"
                      variant={item.isPrimary ? "secondary" : "ghost"}
                      onClick={() =>
                        syncItems(
                          items.map((entry, itemIndex) => ({
                            ...entry,
                            isPrimary: itemIndex === index
                          }))
                        )
                      }
                    >
                      {item.isPrimary ? "Primary" : "Make Primary"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => syncItems(items.filter((_, itemIndex) => itemIndex !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {pendingFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="image-list-item">
              {pendingPreviewUrls[index] ? <img src={pendingPreviewUrls[index]} alt={file.name} /> : null}
              <div className="stack-sm">
                <strong>Pending image {index + 1}</strong>
                <span className="field-hint">{file.name}</span>
                <span className="field-hint">This image will upload when you save the form.</span>
                <div className="row-actions">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setPendingFiles((currentFiles) => currentFiles.filter((_, fileIndex) => fileIndex !== index))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <MediaLibrarySection
        title={`${label} Library`}
        targetFolder={targetFolder}
        files={library.files}
        isLoading={isLoading}
        isUploading={isUploading}
        onUpload={handleUpload}
        selectedUrls={items.map((item) => item.imageUrl)}
        onPickFile={(file) => addImage(file.fileUrl)}
        allowMultiple={true}
        emptyMessage="No images found here yet. Upload images from your device."
        pickLabel="Add image"
      />
      <span className="field-hint">
        {pendingFiles.length
          ? `${pendingFiles.length} image${pendingFiles.length === 1 ? "" : "s"} selected. They will upload when you save the form.`
          : "Choose images to preview them first. Upload runs when you save the form."}
      </span>
    </div>
  );
};

export const DynamicForm = ({
  fields,
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  onValuesChange
}: {
  fields: FieldConfig[];
  defaultValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  submitLabel?: string;
  onValuesChange?: (values: Record<string, unknown>) => void;
}) => {
  const { register, handleSubmit, reset, setValue, watch, getValues } = useForm<Record<string, unknown>>({
    defaultValues
  });
  const pendingUploadHandlersRef = useRef(new Map<string, () => Promise<string | undefined>>());

  useEffect(() => {
    reset(defaultValues ?? {});
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!onValuesChange) {
      return;
    }

    onValuesChange(getValues());
    const subscription = watch((values) => {
      onValuesChange(values as Record<string, unknown>);
    });

    return () => subscription.unsubscribe();
  }, [getValues, onValuesChange, watch]);

  const registerPendingUpload = (fieldName: string, handler: () => Promise<string | undefined>) => {
    pendingUploadHandlersRef.current.set(fieldName, handler);
  };

  return (
    <form
      className="stack-md"
      onSubmit={handleSubmit(async () => {
        for (const [fieldName, handler] of pendingUploadHandlersRef.current.entries()) {
          const nextValue = await handler();
          if (nextValue !== undefined) {
            setValue(fieldName, nextValue, { shouldDirty: true });
          }
        }

        await onSubmit(getValues());
      })}
    >
      {fields.map((field) => {
        if (field.type === "image") {
          return (
            <SingleImageField
              key={field.name}
              label={field.label}
              value={watch(field.name)}
              mediaFolder={field.mediaFolder}
              registerPendingUpload={(handler) => registerPendingUpload(field.name, handler)}
              onChange={(value) => setValue(field.name, value, { shouldDirty: true })}
            />
          );
        }

        if (field.type === "image-list") {
          return (
            <ImageListField
              key={field.name}
              label={field.label}
              value={watch(field.name)}
              mediaFolder={field.mediaFolder}
              registerPendingUpload={(handler) => registerPendingUpload(field.name, handler)}
              onChange={(value) => setValue(field.name, value, { shouldDirty: true })}
            />
          );
        }

        if (field.type === "icon") {
          return (
            <IconPickerField
              key={field.name}
              label={field.label}
              value={watch(field.name)}
              options={field.options}
              onChange={(value) => setValue(field.name, value, { shouldDirty: true })}
            />
          );
        }

        if (field.type === "multi-select") {
          return (
            <MultiSelectField
              key={field.name}
              label={field.label}
              value={watch(field.name)}
              options={field.options}
              valueType={field.valueType}
              onChange={(value) => setValue(field.name, value, { shouldDirty: true })}
            />
          );
        }

        if (field.type === "category-assignments") {
          return (
            <CategoryAssignmentsField
              key={field.name}
              label={field.label}
              value={watch(field.name)}
              options={field.options}
              subOptions={field.subOptions}
              onChange={(value) => setValue(field.name, value, { shouldDirty: true })}
            />
          );
        }

        return (
          <label key={field.name} className="field">
            <span>{field.label}</span>
            {field.type === "textarea" ? (
              <textarea {...register(field.name)} placeholder={field.placeholder} rows={4} />
            ) : field.type === "checkbox" ? (
              <input type="checkbox" {...register(field.name)} />
            ) : field.type === "select" ? (
              <select {...register(field.name)}>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "json" ? (
              <textarea {...register(field.name)} placeholder='{"key":"value"}' rows={6} />
            ) : (
              <input type={field.type} {...register(field.name)} placeholder={field.placeholder} />
            )}
          </label>
        );
      })}
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
};
