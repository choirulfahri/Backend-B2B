declare module 'bcryptjs' {
    /**
     * Synchronously generates a hash for the given string.
     * @param s The string to hash.
     * @param salt The salt length to generate or the salt to use.
     * @returns The hashed string.
     */
    export function hashSync(s: string, salt?: number | string): string;

    /**
     * Asynchronously generates a hash for the given string.
     * @param s The string to hash.
     * @param salt The salt length to generate or the salt to use.
     * @returns A promise to be either resolved with the resulting hash or rejected with an Error.
     */
    export function hash(s: string, salt?: number | string): Promise<string>;

    /**
     * Synchronously tests a string against a hash.
     * @param s The string to compare.
     * @param hash The hash to test against.
     * @returns true if the string matches the hash, otherwise false.
     */
    export function compareSync(s: string, hash: string): boolean;

    /**
     * Asynchronously tests a string against a hash.
     * @param s The string to compare.
     * @param hash The hash to test against.
     * @returns A promise to be either resolved with true or false.
     */
    export function compare(s: string, hash: string): Promise<boolean>;

    /**
     * Synchronously generates a salt.
     * @param rounds The number of rounds to use, defaults to 10 if omitted.
     * @returns The generated salt.
     */
    export function genSaltSync(rounds?: number): string;

    /**
     * Asynchronously generates a salt.
     * @param rounds The number of rounds to use, defaults to 10 if omitted.
     * @returns A promise to be either resolved with the generated salt or rejected with an Error.
     */
    export function genSalt(rounds?: number): Promise<string>;

    /**
     * Gets the number of rounds used to encrypt the specified hash.
     * @param hash The hash to extract the used number of rounds from.
     * @returns The number of rounds used.
     */
    export function getRounds(hash: string): number;

    /**
     * Gets the salt portion from a hash.
     * @param hash The hash to extract the salt from.
     * @returns The salt.
     */
    export function getSalt(hash: string): string;
}
