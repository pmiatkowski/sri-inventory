import * as fs from 'fs/promises';
import * as path from 'path';
import { DOM, generateSRIHash, argsConverter } from './utils'

/**
 * Adds Subresource Integrity (SRI) hashes to link elements in HTML files
 */
export async function sriHashes(...files: string[]) {
    const { target } = argsConverter();
    
    if(!files.length) {
        files = ['index.html'];
    }

    for (const file of files) {
        const filePath = path.resolve(target, file);
        try {
            const rootContent = await fs.readFile(filePath, { encoding: 'utf-8' });

            const document = DOM.parseToHTML(rootContent);
            if(!document) {
                console.error(`Failed to parse HTML content from ${file}`);
                continue;
            }

            /**
             * Enrich elements with SRI hashes
             */
            const linkElements = Array.from(document.querySelectorAll('link,script'));
            await Promise.all(linkElements.map(async (el: HTMLElement) => {
                const src = el.getAttribute('src') || el.getAttribute('href');

                if (!src || src.startsWith('http') || src.startsWith('//')) {
                    return;
                }

                /**
                 *  handle relative paths and remove query strings
                 */
                let sriHash = el.getAttribute('integrity');
                if(!sriHash) {
                    const srcPath = path.resolve(target, src.replace(/^\//, '').replace(/\?.*$/, ''));
                    const fileContent = await fs.readFile(srcPath);
                    sriHash = generateSRIHash(fileContent);
                }
                el.setAttribute('integrity', sriHash);
                el.setAttribute('crossorigin', 'anonymous');

                console.log(`SRI hash for ${src}: ${sriHash}`);
            }));

            /**
             * Save the modified document back to the file
             */
            const updatedContent = DOM.parseToString(document);
            await fs.writeFile(filePath, updatedContent);
            console.log(`SRI hashes added to ${file}`);

        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
        }
    }
}
