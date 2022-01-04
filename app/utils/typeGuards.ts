

export const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};

export const isBoolean = (value: unknown):value is Boolean =>{
    return typeof value === 'boolean'
}