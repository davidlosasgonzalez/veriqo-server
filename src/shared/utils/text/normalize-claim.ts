/**
 * Normaliza un claim eliminando espacios innecesarios y convirtiéndolo a minúsculas.
 * Esta función se usa para comparar claims de forma semántica simple.
 *
 * @param claim Texto original del claim.
 * @returns Claim normalizado.
 */
export function normalizeClaim(claim: string): string {
    return claim.trim().toLowerCase();
}
