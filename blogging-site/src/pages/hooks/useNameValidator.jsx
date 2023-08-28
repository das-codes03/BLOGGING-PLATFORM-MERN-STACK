import { useEffect, useState } from "react";
import validator from "validator";
export default function useNameValidator(valueRef) {
	//while writing the name, automatically format the text

	const checkName = () => {
		let name = (valueRef.current || {}).value || "";
		let s = "";

		for (let i = 0; i < Math.min(name.length, 100); i++) {
			if (!validator.isAlpha(name[i]) && name[i] !== " ") continue;
			else {
				if (name[i] === " ") {
					if (i && s[s.length - 1] !== " ") {
						s += name[i];
					}
				} else {
					if (i && s[s.length - 1] !== " ") {
						s += name[i].toLowerCase();
					} else {
						s += name[i].toUpperCase();
					}
				}
			}
		}
		(valueRef.current || {}).value = s;
	};

	return checkName;
}
