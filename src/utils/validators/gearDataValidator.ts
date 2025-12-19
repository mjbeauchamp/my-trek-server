import validator from 'validator';
import { IGearItemInput } from '../../models/UserGearList.js';

export function isUserGearItem(item: IGearItemInput) {
    return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.name === 'string' &&
        (item.category === undefined || typeof item.category === 'string') &&
        (item.quantityNeeded === undefined || typeof item.quantityNeeded === 'number') &&
        (item.quantityToPack === undefined || typeof item.quantityToPack === 'number') &&
        (item.quantityToShop === undefined || typeof item.quantityToShop === 'number') &&
        (item.notes === undefined || typeof item.notes === 'string')
    );
}

export function isArrayOfGearLists(listArray: unknown) {
    if (!listArray || !Array.isArray(listArray)) {
        return false;
    }

    return listArray.every((list: any) => {
        return (
            typeof list.listTitle === 'string' &&
            Array.isArray(list.items) &&
            list.items.every((item: any) => isUserGearItem(item))
        );
    });
}

export function sanitizeNewGearItem(
    input: unknown,
): { success: true; data: IGearItemInput } | { success: false; error: string } {
    if (!input || typeof input !== 'object') {
        return { success: false, error: 'Invalid gear item payload.' };
    }

    const item = input as Record<string, unknown>;

    // Required: name
    if (typeof item.name !== 'string') {
        return { success: false, error: 'Item name is required.' };
    }

    try {
        const name = validator.escape(validator.trim(item.name));
        if (!name || name.length > 60) {
            return { success: false, error: 'Item name is invalid or too long.' };
        }

        // Optional: category
        let category = '';
        if (item.category !== undefined) {
            if (typeof item.category !== 'string') {
                return { success: false, error: 'Invalid category format.' };
            }
            category = validator.escape(validator.trim(item.category));
            if (category.length > 300) {
                return { success: false, error: 'Gear item category is too long.' };
            }
        }

        // Optional: notes
        let notes = '';
        if (item.notes !== undefined) {
            if (typeof item.notes !== 'string') {
                return { success: false, error: 'Invalid gear item note format.' };
            }
            notes = validator.escape(validator.trim(item.notes));
            if (notes.length > 500) {
                return { success: false, error: 'Gear item note is too long.' };
            }
        }

        // Numeric fields
        const sanitizeQuantity = (value: unknown, field: string) => {
            if (typeof value !== 'number' || !Number.isInteger(value)) {
                throw new Error(`${field} must be an integer`);
            }

            const minValue = field === 'quantityNeeded' ? 1 : 0;

            if (value < minValue || value > 1000) {
                throw new Error(`${field} out of range`);
            }
            return value;
        };

        const quantityNeeded = sanitizeQuantity(item.quantityNeeded, 'quantityNeeded');
        const quantityToPack = sanitizeQuantity(item.quantityToPack, 'quantityToPack');
        const quantityToShop = sanitizeQuantity(item.quantityToShop, 'quantityToShop');

        return {
            success: true,
            data: {
                name,
                category,
                quantityNeeded,
                quantityToPack,
                quantityToShop,
                notes,
            },
        };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Invalid gear item field',
        };
    }
}

export function sanitizePartialGearItem(
    input: unknown,
): { success: true; data: Partial<IGearItemInput> } | { success: false; error: string } {
    if (!input || typeof input !== 'object') {
        return { success: false, error: 'Invalid gear item payload.' };
    }

    const item = input as Record<string, unknown>;
    const updateData: Partial<IGearItemInput> = {};

    try {
        if (item.name || item.name === '') {
            if (typeof item.name !== 'string') {
                return { success: false, error: 'Item name format is invalid.' };
            }
            const name = validator.escape(validator.trim(item.name));

            if (!name || name.length > 60) {
                return { success: false, error: 'Item name is invalid or too long.' };
            }

            updateData.name = name;
        }

        if (item.category || item.category === '') {
            if (typeof item.category !== 'string') {
                return { success: false, error: 'Category format is invalid.' };
            }
            const category = validator.escape(validator.trim(item.category));

            if (category.length > 300) {
                return { success: false, error: 'Gear item category is too long.' };
            }

            updateData.category = category;
        }

        if (item.notes || item.notes === '') {
            if (typeof item.notes !== 'string') {
                return { success: false, error: 'Notes format is invalid.' };
            }
            const notes = validator.escape(validator.trim(item.notes));

            if (notes.length > 500) {
                return { success: false, error: 'Gear item note is too long.' };
            }

            updateData.notes = notes;
        }

        const sanitizeQuantity = (
            value: unknown,
            field: 'quantityNeeded' | 'quantityToPack' | 'quantityToShop',
        ) => {
            if (value || value === 0) {
                if (typeof value !== 'number' || !Number.isInteger(value)) {
                    throw new Error(`${field} must be an integer`);
                }

                const minValue = field === 'quantityNeeded' ? 1 : 0;

                if (value < minValue || value > 1000) {
                    throw new Error(`${field} out of range`);
                }

                updateData[field] = value;
            }
        };

        sanitizeQuantity(item.quantityNeeded, 'quantityNeeded');
        sanitizeQuantity(item.quantityToPack, 'quantityToPack');
        sanitizeQuantity(item.quantityToShop, 'quantityToShop');

        return {
            success: true,
            data: updateData,
        };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Invalid gear item field',
        };
    }
}
