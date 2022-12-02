import * as pluralize from 'pluralize';
import { PluralDictionary, Options } from '../proc/common';

export function initPlural(options: Options) {
	if (options.plural) {
		initPluralize(options.plural);
	}
}

function initPluralize(config: PluralDictionary) {
	config.irregulars.forEach(({ single, plural }) =>
		pluralize.addIrregularRule(single, plural)
	);
}
