import { paceMeasures } from './consts';

export const getPaceByMeasure = (speed: number, paceFormat: string) => {
  if (paceFormat === paceMeasures.MPS) {
    return speed;
  }

  if (paceFormat === paceMeasures.KMPH) {
    return speed ? Math.round((speed * 3.6 + Number.EPSILON) * 100) / 100 : 0;
  }

  if (paceFormat === paceMeasures.MPKM) {
    return speed > 0.27 ? Math.round((60 / (speed * 3.6) + Number.EPSILON) * 1000) / 1000 : 60;
  }

  return null;
};
export const decode = (encodedPath: string, precision = 5) => {
  const factor = Math.pow(10, precision);

  const len = encodedPath.length;

  // For speed we preallocate to an upper bound on the final length, then
  // truncate the array before returning.
  const path = new Array(Math.floor(encodedPath.length / 2));
  let index = 0;
  let lat = 0;
  let lng = 0;
  let pointIndex = 0;

  // This code has been profiled and optimized, so don't modify it without
  // measuring its performance.
  for (; index < len; ++pointIndex) {
    // Fully unrolling the following loops speeds things up about 5%.
    let result = 1;
    let shift = 0;
    let b;
    do {
      // Invariant: "result" is current partial result plus (1 << shift).
      // The following line effectively clears this bit by decrementing "b".
      b = encodedPath.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 31); // See note above.
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 1;
    shift = 0;
    do {
      b = encodedPath.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 31);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    path[pointIndex] = { lat: lat / factor, lng: lng / factor };
  }
  // truncate array
  path.length = pointIndex;

  return path as { lat: number; lng: number }[];
};

// export const getDurationFromSeconds = seconds => new Date().toISOString();
export const getDurationFromSeconds = (seconds: number) =>
  new Date(seconds * 1000).toISOString().slice(11, 19);
export const getFormattedPace = (paceInMins: number) => {
  const pace = paceInMins * 60;
  let duration = getDurationFromSeconds(pace).split(':');
  const hours = Number(duration[0]);

  if (hours) {
    duration = duration.slice(1);
    duration[0] = (Number(duration[0]) + 60 * hours).toString();
    return duration.join(':');
  }
  return duration.slice(1).join(':');
};
export function formatPaceTick(prop: number) {
  return String(getFormattedPace(prop));
}
export function formatTick(prop: number) {
  return String(Math.round((prop + Number.EPSILON) * 100) / 100);
}
