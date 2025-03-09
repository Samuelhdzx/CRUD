import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const sanitizeInput = (input: any): any => {
    if (typeof input === 'string') {
        let sanitized = DOMPurify.sanitize(input, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        });

        sanitized = sanitized
            .replace(/<[^>]*>/g, '')
            .replace(/&[^;]+;/g, '')
            .replace(/javascript:/gi, '')
            .replace(/onerror/gi, '')
            .replace(/onload/gi, '')
            .replace(/onclick/gi, '')
            .replace(/onmouseover/gi, '')
            .trim();

        return sanitized;
    } else if (Array.isArray(input)) {
        return input.map(item => sanitizeInput(item));
    } else if (typeof input === 'object' && input !== null) {
        const sanitizedObj: any = {};
        for (const key in input) {
            sanitizedObj[key] = sanitizeInput(input[key]);
        }
        return sanitizedObj;
    }
    return input;
};

export const sanitizeAndValidate = (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = sanitizeInput(req.body);
        req.query = sanitizeInput(req.query);
        req.params = sanitizeInput(req.params);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        next();
    } catch (error) {
        console.error('Sanitization error:', error);
        return res.status(400).json({ error: 'Invalid input data' });
    }
};
