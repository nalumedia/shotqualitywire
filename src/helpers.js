// helpers.js

import React from 'react';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const options = {
    renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const { title, file } = node.data.target.fields;
            const imageUrl = file.url;
            return <img src={`https:${imageUrl}`} alt={title ? title['en-US'] : null} className="img-fluid mb-3" />;
        },
    },
    renderMark: {
        [MARKS.BOLD]: text => <strong>{text}</strong>,
    },
};

export function truncateWords(text, limit) {
    const words = text.split(/\s+/).slice(0, limit);
    return words.join(' ') + (words.length < text.split(/\s+/).length ? '...' : '');
}

export function richTextToPlainText(richText) {
    if (!richText || !richText.content) return '';
    let text = '';
    richText.content.forEach(item => {
        if (item.nodeType === 'text') {
            text += item.value;
        } else if (item.content) {
            text += richTextToPlainText(item);
        }
    });
    
    return text;
}
