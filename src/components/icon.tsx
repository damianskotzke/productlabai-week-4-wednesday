import { HugeiconsIcon, type HugeiconsIconProps, type IconSvgElement } from "@hugeicons/react"

/**
 * The one way to show an icon in this project. Icons are Hugeicons (outline):
 *
 *   import { Search01Icon } from "@hugeicons/core-free-icons"
 *   <Icon icon={Search01Icon} />
 *
 * Find icons at https://hugeicons.com/icons. Set the size with a class: `size-5`.
 */
function Icon({ strokeWidth = 1.5, ...props }: HugeiconsIconProps) {
  return <HugeiconsIcon data-slot="icon" strokeWidth={strokeWidth} {...props} />
}

export { Icon, type IconSvgElement }
