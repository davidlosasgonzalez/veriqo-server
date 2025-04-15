export function extractKeywordsFromClaim(claim: string): string[] {
    return claim
        .split(' ')
        .filter((word) => word.length > 4)
        .slice(0, 3);
}
