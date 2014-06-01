/**
 * Iterate over collection
 * @param  {mixed}    collection Array or 1 key deep object literal
 * @param  {Function} fn         Call this function for each. If function returns false the loop will break
 * @return {void}
 */
function each(collection, fn) {
	var
		i = 0,
		l = collection.length,
		cont;

	for (; i < l; i++) {
		cont = fn(collection[i], i);
		if (cont === false) {
			break; //allow early exit
		}
	}
}