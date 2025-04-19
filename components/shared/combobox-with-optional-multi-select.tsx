import React, {useCallback, useMemo, useState} from "react";

import {CheckIcon, ChevronsUpDown, X} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: SelectOption[]; // Available options
  isMultiSelect?: boolean; // Toggle multi-select mode
  placeholder?: string; // Placeholder text
  selectedOptions: SelectOption[]; // Controlled selected options
  onChange: (options: SelectOption[]) => void; // Callback for selection changes
  name: string; // Unique identifier
  disabled?: boolean; // Disable control
  className?: string; // Custom classes for styling
  searchPlaceholder?: string; // Custom search input placeholder
  noOptionsText?: string; // Custom no options message
}

// SelectionBadge component with CSS-based exit animation
const SelectionBadge: React.FC<{
  label: string;
  onRemove: () => void;
}> = ({label, onRemove}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    // Trigger removal after animation
    setTimeout(() => onRemove(), 150);
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "mr-1 flex h-6 items-center gap-1 rounded-full pl-2 pr-1 text-sm transition-all duration-150 ease-in-out",
        isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
      )}>
      {/* Truncated label for overflow */}
      <span className="inline-block max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap align-middle leading-normal">
        {label}
      </span>
      {/* Remove button */}
      <span
        role="button"
        tabIndex={0}
        onClick={e => {
          e.stopPropagation();
          handleRemove();
        }}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            handleRemove();
          }
        }}
        aria-label={`Remove ${label}`}
        className="flex size-4 items-center justify-center rounded-full transition-colors duration-150 ease-in-out hover:bg-muted-foreground/20 focus:outline-none cursor-pointer">
        <X className="size-3" />
      </span>
    </Badge>
  );
};

export const ComboboxWithOptionalMultiSelect: React.FC<ComboboxProps> = ({
  options,
  isMultiSelect = false,
  placeholder = "Select options...",
  selectedOptions,
  onChange,
  name,
  disabled = false,
  className,
  searchPlaceholder = `Search ${name}...`,
  noOptionsText = `No ${name} options found.`,
}) => {
  const [isOpen, setIsOpen] = useState(false); // State for popover open/close
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const id = `combobox-${name}`; // Unique ID for accessibility

  // Handle option selection
  const handleSelect = useCallback(
    (value: string) => {
      const selectedOption = options.find(option => option.value === value);
      if (!selectedOption) return;

      const newOptions = isMultiSelect
        ? selectedOptions.some(opt => opt.value === value)
          ? selectedOptions.filter(opt => opt.value !== value)
          : [...selectedOptions, selectedOption]
        : [selectedOption];

      onChange(newOptions);

      // Close popover for single select
      if (!isMultiSelect) {
        setIsOpen(false);
        setSearchQuery("");
      }
    },
    [isMultiSelect, options, selectedOptions, onChange]
  );

  // Handle badge removal
  const handleRemoveBadge = useCallback(
    (value: string) => {
      onChange(selectedOptions.filter(opt => opt.value !== value));
    },
    [selectedOptions, onChange]
  );

  // Filter options based on search query (no debounce)
  const filteredOptions = useMemo(
    () =>
      searchQuery
        ? options.filter(option => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : options,
    [options, searchQuery]
  );

  // Render display content
  const displayContent = useMemo(() => {
    if (selectedOptions.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }
    return isMultiSelect ? (
      <div className="flex flex-wrap gap-1 py-1 items-center">
        {selectedOptions.map(opt => (
          <SelectionBadge
            key={opt.value}
            label={opt.label}
            onRemove={() => handleRemoveBadge(opt.value)}
          />
        ))}
        {selectedOptions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              onChange([]);
            }}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive ml-1"
            aria-label="Clear all selections">
            Clear all
          </Button>
        )}
      </div>
    ) : (
      <span className="truncate">{selectedOptions.map(opt => opt.label).join(", ")}</span>
    );
  }, [selectedOptions, isMultiSelect, placeholder, handleRemoveBadge, onChange]);

  // Accessibility label
  const ariaLabel = isMultiSelect
    ? `${name} filter - ${selectedOptions.length} selected`
    : `${name} filter`;

  return (
    <div className={cn("space-y-1", className)}>
      {/* Hidden label for accessibility */}
      <label
        htmlFor={id}
        className="sr-only">
        {placeholder}
      </label>
      <Popover
        open={isOpen}
        onOpenChange={open => {
          setIsOpen(open);
          if (!open) setSearchQuery("");
        }}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            aria-label={ariaLabel}
            aria-haspopup="listbox"
            disabled={disabled}
            className="min-w-[200px] w-full max-w-[400px] justify-between text-left font-normal h-auto min-h-[40px] px-3 py-2">
            <span className="flex-1 overflow-hidden">{displayContent}</span>
            {!(selectedOptions.length > 0) && (
              <ChevronsUpDown
                className={cn(
                  " size-4 shrink-0 opacity-50 transition-transform duration-200",
                  isOpen ? "rotate-180" : "rotate-0"
                )}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[--radix-popover-trigger-width] min-w-[200px] max-w-[400px] p-0">
          <Command>
            {/* Search input */}
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-9"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-[200px] overflow-auto scroll-smooth thin-scrollbar">
              <CommandEmpty className="py-3 text-center text-sm">{noOptionsText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map(option => {
                  const isSelected = selectedOptions.some(o => o.value === option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="flex items-center gap-2"
                      aria-selected={isSelected}>
                      {isMultiSelect && (
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-input",
                            isSelected && "border-primary bg-primary text-primary-foreground"
                          )}
                          aria-hidden="true">
                          <CheckIcon className={cn("size-3", !isSelected && "opacity-0")} />
                        </div>
                      )}
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
