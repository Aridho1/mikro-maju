import isTypeOf from "./typeof.js";

export const IDR = new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

/**
 * convert string to slug
 * @param {string} text
 * @returns {string} string slug
 *
 * @example
 * toSlug('hello world');      // 'hello-world'
 * toSlug(' hello   world  '); // 'hello-world'
 * toSlug('hello');            // 'hello'
 */
export const toSlug = (text) => isTypeOf({ text }, "string") && text.trim().replace(/\s+/, "-");

/**
 * convert slug to text
 * @param {string} text slug
 * @returns {string} string text
 *
 * @example
 * toSlug('hello-world');      // 'hello world'
 */
export const slugToText = (text) => isTypeOf({ text }, "string") && text.replace(/\-/g, " ");

/**
 * check is length of string is more than n
 * @param {string} text
 * @param {number} limit
 * @param {string?} [endPrefix='...'] default '...'
 * @returns {[result:string, isReadMore:boolean]}
 */
export const readMore = (text, limit = 100, endPrefix = "...") => {
	isTypeOf({ text }, "string");
	isTypeOf({ limit }, "number");
	isTypeOf({ endPrefix }, "string");

	const res = text.slice(0, limit);

	const isDiff = res != text;

	return [res, isDiff];
};

/**
 * convert first letter of word to upper case
 * @param {string} text
 * @returns {string}
 *
 * @example
 * upperingFirstLetterOfWord('hello world'); // 'Hello World'
 */
export const upperingFirstLetterOfWord = (text) =>
	isTypeOf({ text }, "string") &&
	text
		.split(/\s/)
		.map((word) => word.at(0)?.toUpperCase() + word.slice(1))
		.join(" ");

/**
 * convert first letter of text to upper case
 * @param {string} text
 * @returns {string}
 *
 * @example
 * upperingFirstLetter('hello world'); // 'Hello world'
 */
export const upperingFirstLetter = (text) => isTypeOf({ text }, "string") && text.split(/\s/).map((word, i) => (i ? word : word.at(0)?.toUpperCase() + word.slice(1)).join(" "));
