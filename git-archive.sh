#!/bin/bash
if [[ -z "${1}" ]]; then
	BRANCH='master';
else
	BRANCH="${1}";
fi;
ARCHIVE_FILE="${HOME}/${PWD##*/}.tar.gz"
git archive --format=tar.gz --prefix="${PWD##*/}/" -o "${ARCHIVE_FILE}" "${BRANCH}"
chmod 444 "${ARCHIVE_FILE}"
