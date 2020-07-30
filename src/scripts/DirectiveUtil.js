// https://stackoverflow.com/questions/10934664/convert-string-in-dot-notation-to-get-the-object-reference/10934946#10934946
function setValue(obj, str, val) {
	str = str.split('.');
	while (str.length > 1) {
		obj = obj[str.shift()];
	}
	return obj[str.shift()] = val;
}

function getValue(obj, str) {
    str = str.split(".");
    for (var i = 0; i < str.length; i++)
        obj = obj[str[i]];
    return obj;
}

export default {
	setValue,
	getValue
}