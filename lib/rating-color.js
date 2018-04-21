class RatingColor {
  static ratingToColor(rating) {
    const green = 495;
    const red = 750;
    const wl = green + (red - green) * (100 - rating) / 100;

    return _wavelengthToColor(wl);
  }
}

function _wavelengthToColor(wavelength) {
  let R;
  let G;
  let B;
  const wl = wavelength;

  if (wl >= 380 && wl < 440) {
    R = -1 * (wl - 440) / (440 - 380);
    G = 0;
    B = 1;
  } else if (wl >= 440 && wl < 490) {
    R = 0;
    G = (wl - 440) / (490 - 440);
    B = 1;
  } else if (wl >= 490 && wl < 510) {
    R = 0;
    G = 1;
    B = -1 * (wl - 510) / (510 - 490);
  } else if (wl >= 510 && wl < 580) {
    R = (wl - 510) / (580 - 510);
    G = 1;
    B = 0;
  } else if (wl >= 580 && wl < 645) {
    R = 1;
    G = -1 * (wl - 645) / (645 - 580);
    B = 0.0;
  } else if (wl >= 645 && wl <= 780) {
    R = 1;
    G = 0;
    B = 0;
  } else {
    R = 0;
    G = 0;
    B = 0;
  }

  R = Math.floor(255 * R);
  G = Math.floor(255 * G);
  B = Math.floor(255 * B);
  return `rgba(${R},${G},${B}, ${0.75})`;
}

module.exports = RatingColor;
