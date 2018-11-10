function fitRect(wdest, hdest, wsrc, hsrc) {
	var ratioSrc = wsrc / hsrc, ratioDest = wdest / hdest;
	var scale = (ratioSrc > ratioDest) ? (wsrc / wdest) : (hsrc / hdest);
	return {
		width: Math.round(wsrc / scale),
		height: Math.round(hsrc / scale),
	};
}
module.exports = fitRect;
