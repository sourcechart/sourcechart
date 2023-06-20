/****************************
 *     -----------------    *
 *     SOURCECHART TYPES    *
 *     -----------------    *
 *                          *
 *****************************/

type Chart = {
	shape: string;
	chartID: string;
	chartType: string | null;
	filename: string | null;
	aggregator: string | null;
	datasetID: string | null;
	columns: Array<string>;
	groupbyColumns: Array<string>;
	xColumn: string | null;
	yColumn: string | null;
	xData: Array<number>;
	yData: Array<number>;
	database: AsyncDuckDB;
	chartOptions: ChartOptions;
};

type ChartOptions = {
	xAxis: {
		data: Array<number>;
	};
	series: [
		{
			data: Array<number>;
			type: string;
		}
	];
};

type SelectBlock = {
	xColumn: { column: string | null | undefined };
	yColumn: { column: string | null | undefined; aggregator: string | null | undefined };
	from: string | undefined | null;
};

type Queries = {
	select: SelectBlock;
	//filters: Array<Condition>;
	//having: Array<Condition>;
	groupbyColumns: Array<string | null | undefined> | undefined;
};
type Condition = { column: string; filter: string | null | number };

type QueryObject = {
	chartID: string | null | unknown;
	queries: Queries;
};

type fileUpload = {
	filename: string;
	columns: Array<null | string>;
	size: number;
	datasetID: string;
	database: AsyncDuckDB;
};

type Field = {
	name?: string;
	type: any;
	nullable?: boolean;
	databaseType: string;
};

interface Point {
	x: number;
	y: number;
}

/****************************
 *                          *
 *       Canvas Types       *
 *                          *
 ***************************/

/******************************************************************************************************************************
 *  DEFINITIONS
 *        isMoving: when you are moving a rectangle to a different position withough changing the dimensions                  *
 *        isResizing: when you change the width, height or radius, of a polygon that already exists by manipulating and edge  *
 *        isDrawing: When you are creating a rectangle or polygon via the draw button(s)                                      *
 *        isErasing: When you are erasing a polygon with onTouch with your mouse                                              *
 *        isHovering: default state of the mouse where you can move it but it is not clicked                                                                                                                  *
 *****************************************************************************************************************************/

type MouseEvents = 'isMoving' | 'isResizing ' | 'isDrawing' | 'isErasing' | 'isHovering';

type NavBar = 'eraser' | 'select' | 'drawRectangle' | 'drawCircle' | 'textbox';

interface Point {
	x: number;
	y: number;
}
interface Polygon {
	id?: string;
	vertices: Point[];
}

interface MouseEventExtended extends MouseEvent {
	offsetX: number;
	offsetY: number;
}

/****************************
 *                          *
 * FLOWBITE SVELTE UI TYPES *
 *                          *
 ***************************/
type BlockQuoteType =
	| 'xs'
	| 'sm'
	| 'base'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| '8xl'
	| '9xl';

type ButtonType = 'button' | 'submit' | 'reset';

type ButtonColorType =
	| 'alternative'
	| 'blue'
	| 'cyan'
	| 'dark'
	| 'light'
	| 'lime'
	| 'green'
	| 'pink'
	| 'primary'
	| 'red'
	| 'teal'
	| 'yellow'
	| 'purple'
	| 'purpleToBlue'
	| 'cyanToBlue'
	| 'greenToBlue'
	| 'purpleToPink'
	| 'pinkToOrange'
	| 'tealToLime'
	| 'redToYellow';

type Colors =
	| 'blue'
	| 'gray'
	| 'red'
	| 'yellow'
	| 'purple'
	| 'green'
	| 'indigo'
	| 'pink'
	| 'white'
	| 'custom'
	| 'primary'
	| 'secondary';

type ImgType = {
	src: string;
	alt?: string;
};

type IndicatorColorType =
	| 'gray'
	| 'dark'
	| 'blue'
	| 'green'
	| 'red'
	| 'purple'
	| 'indigo'
	| 'yellow'
	| 'teal'
	| 'none';

type IndicatorPlacementType =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'center-left'
	| 'center'
	| 'center-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right'
	| undefined;

type InputType =
	| 'color'
	| 'date'
	| 'datetime-local'
	| 'email'
	| 'file'
	| 'hidden'
	| 'image'
	| 'month'
	| 'number'
	| 'password'
	| 'reset'
	| 'submit'
	| 'tel'
	| 'text'
	| 'time'
	| 'url'
	| 'week'
	| 'search';

type drawerTransitionTypes =
	| 'fade'
	| 'fly'
	| 'slide'
	| 'blur'
	| 'in:fly'
	| 'out:fly'
	| 'in:slide'
	| 'out:slide'
	| 'in:fade'
	| 'out:fade'
	| 'in:blur'
	| 'out:blur'
	| undefined;

type FormColorType =
	| 'blue'
	| 'red'
	| 'green'
	| 'purple'
	| 'teal'
	| 'yellow'
	| 'orange'
	| 'primary'
	| 'secondary';

type ModalPlacementType =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'center-left'
	| 'center'
	| 'center-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right';

type PsizeType =
	| 'xs'
	| 'sm'
	| 'base'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| '8xl'
	| '9xl';

type PweightType =
	| 'thin'
	| 'extralight'
	| 'light'
	| 'normal'
	| 'medium'
	| 'semibold'
	| 'bold'
	| 'extrabold'
	| 'black';

type TableColorType =
	| 'blue'
	| 'green'
	| 'red'
	| 'yellow'
	| 'purple'
	| 'indigo'
	| 'pink'
	| 'default'
	| 'custom';

type ToolbarColorType =
	| 'gray'
	| 'red'
	| 'yellow'
	| 'green'
	| 'indigo'
	| 'purple'
	| 'pink'
	| 'blue'
	| 'dark'
	| 'none';

type ToolbarButtonType =
	| 'dark'
	| 'default'
	| 'gray'
	| 'red'
	| 'yellow'
	| 'green'
	| 'indigo'
	| 'purple'
	| 'pink'
	| 'blue';

declare const xs = 'xs';
declare const sm = 'sm';
declare const md = 'md';
declare const lg = 'lg';
declare const xl = 'xl';
declare type SizeType = typeof xs | typeof sm | typeof md | typeof lg | typeof xl;

declare type FormSizeType = typeof sm | typeof md | typeof lg;

type ReviewType = {
	name: string;
	imgSrc: string;
	imgAlt: string;
	address: string | undefined;
	reviewDate: string | undefined;
	title: string;
	rating: number;
	item1: string | undefined;
	item2: string | undefined;
	item3: string | undefined;
};

type SelectOptionType = {
	name: string | number;
	value: string | number;
};

type TransitionTypes =
	| 'fade'
	| 'fly'
	| 'slide'
	| 'blur'
	| 'in:fly'
	| 'out:fly'
	| 'in:slide'
	| 'out:slide'
	| 'in:fade'
	| 'out:fade'
	| 'in:blur'
	| 'out:blur';

interface ActivityType {
	title: HTMLElement | string;
	date: Date | string;
	src: string;
	alt: string;
	text?: HTMLElement | string;
}

interface drawerTransitionParamTypes {
	amount?: number;
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
	opacity?: number;
	x?: number;
	y?: number;
}

interface GroupTimelineType {
	title: string | HTMLElement;
	src: string;
	alt: string;
	href?: string;
	isPrivate?: boolean;
	comment?: string | HTMLElement;
}

interface ListGroupItemType {
	current?: boolean;
	disabled?: boolean;
	href?: string;
	[propName: string]: any;
}

interface LinkType {
	name: string;
	href?: string;
	rel?: string;
	active?: boolean;
}

interface NavbarType {
	name: string;
	href: string;
	rel?: string;
	child?: NavbarType[];
}

interface SiteType {
	name: string;
	href: string;
	img?: string;
}

interface TimelineItemVerticalType {
	date: Date | string;
	title: string;
	icon?: typeof SvelteComponent;
	iconSize?: number;
	iconClass?: string;
	href?: string;
	linkname?: string;
	text?: HTMLElement | string;
}

interface TimelineItemHorizontalType {
	date: Date | string;
	title: string;
	icon?: typeof SvelteComponent;
	iconSize?: number;
	iconClass?: string;
	text?: HTMLElement | string;
}

interface TransitionParamTypes {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
	css?: (t: number, u: number) => string;
	tick?: (t: number, u: number) => void;
}

interface ButtonClassesTypes {
	default?: string;
	border?: string;
	application?: string;
	pagination?: string;
	group?: string;
	card?: string;
	meeting?: string;
	video?: string;
	custom?: string;
}
