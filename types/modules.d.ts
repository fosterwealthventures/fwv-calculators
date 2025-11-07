declare module 'react-markdown' {
    import { ComponentType } from 'react';

    interface ReactMarkdownProps {
        children?: string;
        components?: Record<string, ComponentType>;
        remarkPlugins?: any[];
        rehypePlugins?: any[];
        [key: string]: any;
    }

    const ReactMarkdown: ComponentType<ReactMarkdownProps>;
    export default ReactMarkdown;
}

declare module 'rehype-katex' {
    const rehypeKatex: any;
    export default rehypeKatex;
}

declare module 'remark-gfm' {
    const remarkGfm: any;
    export default remarkGfm;
}

declare module 'remark-math' {
    const remarkMath: any;
    export default remarkMath;
}

declare module 'marked' {
    const marked: {
        parse: (markdown: string, options?: any) => string;
    };
    export default marked;
}

declare module 'gray-matter' {
    const grayMatter: {
        (input: string, options?: any): {
            data: any;
            content: string;
            excerpt?: string;
        };
    };
    export default grayMatter;
}

declare module 'lucide-react' {
    export const Icons: any;
    export const DollarSign: any;
    export const Calculator: any;
    export const Users: any;
    export const Plus: any;
    export const Download: any;
    export const X: any;
    export const Calendar: any;
    export const Baby: any;
    export const Receipt: any;
    export const Trash2: any;
    export const Settings2: any;
    export const Scale: any;
    export const Info: any;
    export const BarChart3: any;
    export const Home: any;
    export const PiggyBank: any;
    export const ShoppingCart: any;
    export const TrendingUp: any;
    export const Share2: any;
    export const Check: any;
    export const Edit3: any;
    export const PlusCircle: any;
    export * from 'lucide-react';
}

declare module 'clsx' {
    const clsx: (...inputs: any[]) => string;
    export default clsx;
}

declare module '@tailwindcss/forms' {
    const forms: any;
    export default forms;
}

declare module '@tailwindcss/typography' {
    const typography: any;
    export default typography;
}