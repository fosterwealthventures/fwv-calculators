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
