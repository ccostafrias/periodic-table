export function getCategoryAbbr(category) {
    return category.split(' ').map(c => c.charAt(0)).join('')
}