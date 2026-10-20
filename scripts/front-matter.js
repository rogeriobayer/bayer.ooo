const matter = require('gray-matter');
const yaml = require('js-yaml');

// gray-matter's default engine uses the removed js-yaml 3 safeLoad API.
// An explicit engine lets us use maintained js-yaml 4 without argparse 1/sprintf-js.
module.exports = source => matter(source, {
  engines: { yaml: { parse: yaml.load, stringify: yaml.dump } },
});
