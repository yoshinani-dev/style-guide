const dictPath = import.meta.dirname + "/cspell/words.txt";

export default {
  // Enable your dictionary by adding it to the list of `dictionaries`
  dictionaries: ["custom-words"],
  // Tell CSpell about your dictionary
  dictionaryDefinitions: [
    {
      // The name of the dictionary is used to look it up.
      name: "custom-words",
      // Path to the custom word file. Relative to this `cspell.json` file.
      path: dictPath,
      // Some editor extensions will use `addWords` for adding words to your
      // personal dictionary.
      addWords: true,
    },
  ],
};
