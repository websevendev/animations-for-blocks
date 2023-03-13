import type {
	AnimationsForBlocks,
} from './AnimationsForBlocks'

export type {
	AnimationsForBlocks,
}

export type BlockAttributes<T = void> = Record<string, any> & T

export type AnimationsForBlocksBlockAttributes = BlockAttributes<{animationsForBlocks: AnimationsForBlocks | undefined}>

export interface Block<T = BlockAttributes> {
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

export interface BlockListBlockProps<T = BlockAttributes> {
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
