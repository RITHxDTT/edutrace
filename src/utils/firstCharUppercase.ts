export function firstCharUppercase(value: string, startIndex: number): string {
    return value.charAt(startIndex).toUpperCase().concat(value.substring(2))
}