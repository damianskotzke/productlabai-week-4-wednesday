import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type ColorOption<Value extends string> = {
  value: Value
  label: string
  /** Tailwind classes for the swatch, for example "bg-note-yellow". */
  className: string
}

type ColorPickerProps<Value extends string> = {
  value: Value
  options: ColorOption<Value>[]
  onChange: (value: Value) => void
}

/**
 * A colour button for the context bar. It shows the current colour as a swatch. Use it in the `toolbar` of your node:
 *
 *   <ColorPicker value={data.color} options={COLORS} onChange={(color) => updateData({ color })} />
 */
function ColorPicker<Value extends string>({ value, options, onChange }: ColorPickerProps<Value>) {
  const current = options.find((option) => option.value === value)
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            data-slot="color-picker"
            variant="ghost"
            size="icon"
            aria-label="Colour"
            title="Colour"
            className="rounded-sm text-foreground [&_svg:not([class*='size-'])]:size-5"
          />
        }
      >
        <span
          data-slot="color-picker-swatch"
          className={cn("size-5 rounded-full border", current?.className)}
        />
      </PopoverTrigger>
      <PopoverContent data-board-ui side="top" sideOffset={12} className="w-auto flex-row gap-1.5 p-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            title={option.label}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
            className={cn(
              "size-6 rounded-full border outline-offset-2 outline-selection aria-pressed:outline-2",
              option.className,
            )}
          />
        ))}
      </PopoverContent>
    </Popover>
  )
}

export { ColorPicker }
