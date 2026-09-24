const WHITESPACES =
  "\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002" +
  "\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
const FIRST_DIGIT_OR_ASCII = /^[0-9a-z]/i;
const SYNTAX_SOLIDUS = /^[$()*+./?[\\\]^{|}]/;
const OTHER_PUNCTUATORS_AND_WHITESPACES = RegExp(
  `^[!"#%&',\\-:;<=>@\`~${WHITESPACES}]`
);

const ControlEscape = {
  "\u0009": "t",
  "\u000A": "n",
  "\u000B": "v",
  "\u000C": "f",
  "\u000D": "r",
};

const escapeChar = (character: string) => {
  const hex = character.charCodeAt(0).toString(16);

  return hex.length < 3
    ? `\\x${hex.padStart(2, "0")}`
    : `\\u${hex.padStart(4, "0")}`;
};

/**
 * Polyfill for [Regex.escape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/escape)
 *
 * Deprecate it in favor of built-in once Typescript supports [ES2025](https://github.com/microsoft/TypeScript/issues/61735)
 */
const escapeRegex = (regex: string) => {
  const { length } = regex;
  const result: string[] = Array.from({ length }, () => "");

  for (let i = 0; i < length; i++) {
    const character = regex.charAt(i);

    if (i === 0 && FIRST_DIGIT_OR_ASCII.exec(character)) {
      result[i] = escapeChar(character);
    } else if (Object.prototype.hasOwnProperty.call(ControlEscape, character)) {
      result[i] = `\\${ControlEscape[character as keyof typeof ControlEscape]}`;
    } else if (SYNTAX_SOLIDUS.exec(character)) {
      result[i] = `\\${character}`;
    } else if (OTHER_PUNCTUATORS_AND_WHITESPACES.exec(character)) {
      result[i] = escapeChar(character);
    } else {
      const charCode = character.charCodeAt(0);

      // * Single UTF-16 code unit
      if ((charCode & 0xf800) !== 0xd800) result[i] = character;
      // * Unpaired surrogate
      else if (
        charCode >= 0xdc00 ||
        i + 1 >= length ||
        (regex.charCodeAt(i + 1) & 0xfc00) !== 0xdc00
      )
        result[i] = escapeChar(character);
      // * Surrogate pair
      else {
        result[i] = character;

        i += 1;
        result[i] = regex.charAt(i);
      }
    }
  }

  return [...result].join("");
};

export { escapeRegex };
