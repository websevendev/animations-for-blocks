import type {
	AnimationsForBlocks,
} from './AnimationsForBlocks'

export type {
	AnimationsForBlocks,
}

export type {
	AnimationContainerBlockAttributes,
} from './blocks/animation-container'

export type BlockAttributes<T extends object = {}> = Record<string, any> & T

export type AnimationsForBlocksBlockAttributes<T extends object = {}> = BlockAttributes<{animationsForBlocks?: AnimationsForBlocks} & T>

export interface AnimationsForBlocksBlockContext {
	/** Is the provider block enabled to provide its' animation. */
	animationsForBlocksProvider?: boolean
	/** The provided animation configuration. */
	animationsForBlocksAnimation?: AnimationsForBlocks
	/** Delay subsequent animations incrementally by this amount. */
	animationStagger?: number
}

export interface BlockEditProps<T extends object = {}, C extends object = {}> {
	clientId: string
	name: string
	attributes: BlockAttributes & T
	setAttributes: (nextAttributes: Partial<BlockAttributes & T>) => void
	context: Record<string, any> & C
	[key: string]: any
}

export interface Block<T extends object = BlockAttributes> {
	clientId: string
	name: string
	attributes: BlockAttributes<T>
	isValid: boolean
	originalContent: string
	innerBlocks: Block<BlockAttributes<T>>[]
	validationIssues: {
		args: any[],
		log: (message: string) => void,
	}[]
}

export interface BlockListBlockProps<T extends object = BlockAttributes> {
	rootClientId?: string
	clientId: string
	name: string
	className?: string
	isLocked: boolean
	isSelected: boolean
	isSelectionEnabled: boolean
	isValid: boolean
	mode: 'visual' | 'html'
	attributes: BlockAttributes<T>
	setAttributes: (nextAttributes: Partial<BlockAttributes<T>>) => void
	block: Block<BlockAttributes<T>>
	wrapperProps?: Record<string, any>
}
