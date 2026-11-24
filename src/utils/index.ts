export const formatDate = (date: string | Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return new Date(date).toLocaleDateString('en-US', options);
}

export const slugify = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

/**
 * Calculates years of experience from a 1-based start year/month,
 * floored to completed half-year increments (e.g., 7, 7.5, 8).
 */
export const calculateExperienceYears = (
    startYear: number,
    startMonth: number,
    referenceDate: Date = new Date()
): number => {
    const totalMonths =
        (referenceDate.getFullYear() - startYear) * 12 +
        (referenceDate.getMonth() + 1 - startMonth);

    if (totalMonths <= 0) {
        return 0;
    }

    return Math.floor(totalMonths / 6) * 0.5;
};

/**
 * Formats years of experience as a human-readable label (e.g., "1 year", "7.5 years").
 */
export const formatExperienceYears = (years: number): string => {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
};
