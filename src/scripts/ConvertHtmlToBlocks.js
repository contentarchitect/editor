import Blocks from "@/scripts/Blocks.js"

const convertHtmlToBlocks = function (html) {

    const parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");

    let blocks = []

    doc.querySelectorAll(".block").forEach(block => {
        const blockName = block.dataset.blockName;

        debugger;

        const blockInstance = new Blocks.blocks[blockName]();

        blocks.push({
            name: blockName,
            id: blockInstance.id,
            ...Blocks.blocks[blockName].serializeFromHTML(block)
        })
    })

    return blocks;



    return [
        {
            id: 81,
            name: "Quote",
            content: "Typography is a complex system of interrelated styles. 100s of style declarations on dozens of elements must be in harmonious order. Trying one design change can mean making dozens of tedious recalculations and CSS value changes. Creating new Typography themes with CSS feels hard.",
            cite: "Typography.js"
        },
        {
            id: 1,
            name: "Header",
            content: "Typography.js",
            level: 1
        },
        {
            id: 2,
            name: "Wysiwyg",
            content: "<p>A powerful toolkit for building websites with beautiful design.</p>"
        },
        {
            id: 3,
            name: "Header",
            level: 2,
            content: "Install"
        },
        {
            id: 4,
            name: "Wysiwyg",
            content: "<p><code>npm install typography</code></p>"
        },
        {
            id: 5,
            name: "Header",
            level: 2,
            content: "Demo/playground"
        },
        {
            id: 6,
            name: "Wysiwyg",
            level: 2,
            content: "<p><a href='#'>http://kyleamathews.github.io/typography.js</a></p>"
        },
        {
            id: 7,
            name: "Header",
            level: 2,
            content: "Why"
        },
        {
            id: 8,
            name: "Wysiwyg",
            content: `
            <p>Typography is a complex system of interrelated styles. 100s of style declarations on dozens of elements must be in harmonious order. Trying one design change can mean making dozens of tedious recalculations and CSS value changes. Creating new Typography themes with CSS feels hard.</p>
            <p>Typography.js provides a vastly simpler way to define and explore typography designs.</p>
            <p>You provide configuration to the Typography.js JS api and it uses its Typography engine to generate CSS for block and inline elements.</p>
            <p>Typography.js makes it easy to create designs that are unique, personal, and custom to your project.</p>
            `
        },
        {
            id: 9,
            name: "Header",
            content: 'Themes & Plugins',
            level: 2
        },
        {
            id: 10,
            name: "Wysiwyg",
            content: `
            <ul>
                <li><strong>themes</strong>: Typography.js themes are simple Javascript objects. As
                such they’re easy to share across projects or even
                <a href="https://www.npmjs.com/browse/keyword/typography-theme">open source and share via
                NPM</a>.</li>
                <li><strong>plugins</strong>: Plugins are functions that extend or modify the core
                Typography engine. They can change how headers are styled
                or add specialized styles e.g. for code or tables.</li>
            </ul>
            `,
        },
        {
            id: 11,
            name: "Header",
            level: 2,
            content: "Sites that use Typography.js",
        },
        {
            id: 12,
            name: "Wysiwyg",
            content: `
            <ul>
                <li><a href="https://bricolage.io/?utm_source=github.com">bricolage.io</a> (<a href="https://github.com/KyleAMathews/blog/blob/master/blog-typography.coffee">source</a>)</li>
                <li><a href="https://kyleamathews.github.io/react-headroom/">React Headroom</a> (<a href="https://github.com/KyleAMathews/react-headroom/blob/master/www/utils/typography.js">source</a>)</li>
                <li><a href="http://gatsbyjs.github.io/gatsby-starter-blog/">Gatsby Blog Starter</a> (<a href="https://github.com/gatsbyjs/gatsby-starter-blog/blob/master/utils/typography.js">source</a>)</li>
                <li><a href="http://ollieglass.com/">ollieglass.com</a></li>
                <li><a href="https://github.com/KyleAMathews/typography.js/blob/master/README.md">Edit this file to add yours!</a></li>
            </ul>`,
        },
        {
            id: 13,
            name: "Header",
            level: 2,
            content: 'Javascript usage',
        },
        {
            id: 14,
            name: "Wysiwyg",
            content: `
                <pre>
                    <code>
const typography = new Typography({
    baseFontSize: '18px',
    baseLineHeight: 1.666,
    headerFontFamily: ['Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
    bodyFontFamily: ['Georgia', 'serif'],
    // See below for the full list of options.
})

// Output CSS as string.
typography.toString()

// Or insert styles directly into the <head> (works well for client-only
// JS web apps.
typography.injectStyles()
                    </code>
                </pre>
            `,
        },
    ];
}

export default convertHtmlToBlocks;